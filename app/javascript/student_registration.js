// Firebase初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// パスワード強度の視覚的フィードバック
document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    const strengthCheck = checkPasswordStrength(password);
    const strengthBar = document.getElementById('password-strength-bar');
    
    // パスワード要件のチェック表示
    document.getElementById('length-check').style.color = 
        password.length >= 12 ? '#4caf50' : '#666';
    document.getElementById('uppercase-check').style.color = 
        /[A-Z]/.test(password) ? '#4caf50' : '#666';
    document.getElementById('lowercase-check').style.color = 
        /[a-z]/.test(password) ? '#4caf50' : '#666';
    document.getElementById('number-check').style.color = 
        /[0-9]/.test(password) ? '#4caf50' : '#666';
    document.getElementById('special-check').style.color = 
        /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '#4caf50' : '#666';
    
    // 強度バーの更新
    strengthBar.className = 'password-strength-bar';
    if (strengthCheck.strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strengthCheck.strength <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
});

// パスワード確認のチェック
document.getElementById('confirmPassword').addEventListener('input', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;
    const errorElement = document.getElementById('confirmPasswordError');
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'パスワードが一致しません';
        errorElement.style.display = 'block';
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
});

// 学籍番号の重複チェック
async function checkStudentIdExists(studentId) {
    try {
        const snapshot = await db.collection('users')
            .where('studentId', '==', studentId)
            .get();
        
        return !snapshot.empty;
    } catch (error) {
        console.error('学籍番号チェックエラー:', error);
        return false;
    }
}

// メールアドレスの重複チェック
async function checkEmailExists(email) {
    try {
        const snapshot = await db.collection('users')
            .where('email', '==', email)
            .get();
        
        return !snapshot.empty;
    } catch (error) {
        console.error('メールアドレスチェックエラー:', error);
        return false;
    }
}

// エラーメッセージの表示
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// エラーメッセージのクリア
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// すべてのエラーメッセージをクリア
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// 学生登録処理
document.getElementById('studentRegisterForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // エラーメッセージをクリア
    clearAllErrors();
    
    // フォームデータの取得
    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;
    const faculty = document.getElementById('faculty').value;
    const department = document.getElementById('department').value;
    const grade = document.getElementById('grade').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // バリデーション
    let hasError = false;
    
    // 名前のバリデーション
    if (name.length < 2) {
        showError('nameError', '名前は2文字以上で入力してください');
        hasError = true;
    }
    
    // 学籍番号のバリデーション
    if (studentId.length < 5) {
        showError('studentIdError', '学籍番号は5文字以上で入力してください');
        hasError = true;
    } else {
        // 学籍番号の重複チェック
        const studentIdExists = await checkStudentIdExists(studentId);
        if (studentIdExists) {
            showError('studentIdError', 'この学籍番号は既に登録されています');
            hasError = true;
        }
    }
    
    // 学部のバリデーション
    if (!faculty) {
        showError('facultyError', '学部を選択してください');
        hasError = true;
    }
    
    // 学科のバリデーション
    if (department.length < 2) {
        showError('departmentError', '学科は2文字以上で入力してください');
        hasError = true;
    }
    
    // 学年のバリデーション
    if (!grade) {
        showError('gradeError', '学年を選択してください');
        hasError = true;
    }
    
    // メールアドレスのバリデーション
    if (!validateEmail(email)) {
        showError('emailError', '有効なメールアドレスを入力してください');
        hasError = true;
    } else {
        // メールアドレスの重複チェック
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            showError('emailError', 'このメールアドレスは既に登録されています');
            hasError = true;
        }
    }
    
    // パスワードのバリデーション
    const passwordCheck = checkPasswordStrength(password);
    if (!passwordCheck.isValid) {
        showError('passwordError', `パスワードが要件を満たしていません: ${passwordCheck.messages.join(', ')}`);
        hasError = true;
    }
    
    // パスワード確認のバリデーション
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'パスワードが一致しません');
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    try {
        // Firebase認証でユーザーを作成
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // ユーザー情報をFirestoreに保存
        await db.collection('users').doc(userCredential.user.uid).set({
            name,
            studentId,
            faculty,
            department,
            grade: parseInt(grade),
            email,
            role: USER_ROLES.STUDENT,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // メール確認メールの送信
        await userCredential.user.sendEmailVerification();
        
        // 登録成功メッセージの表示
        const successMessage = document.getElementById('error-message');
        successMessage.textContent = '登録が完了しました。確認メールを送信しましたので、メール内のリンクをクリックしてメールアドレスを確認してください。';
        successMessage.style.display = 'block';
        successMessage.classList.add('success-message');
        
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
    } catch (error) {
        console.error('登録エラー:', error);
        
        // エラーメッセージの表示
        let errorMessage = '登録に失敗しました。';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'このメールアドレスは既に使用されています。';
                break;
            case 'auth/invalid-email':
                errorMessage = '無効なメールアドレスです。';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'メール/パスワード認証が有効になっていません。';
                break;
            case 'auth/weak-password':
                errorMessage = 'パスワードが弱すぎます。';
                break;
            default:
                errorMessage = '予期せぬエラーが発生しました。';
        }
        
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
}); 