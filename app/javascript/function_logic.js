// ---------------------
// storage への接続
// ---------------------
function connectToStorage(){
  // storageとの接続
  // Points to the root reference
  var storageRef = firebase.storage().ref();

  // // Points to 'images'
  // var imagesRef = storageRef.child('images');

  // // Points to 'images/space.jpg'
  // // Note that you can use variables to create child values
  // var fileName = 'mentor_icon2.png';
  // var spaceRef = imagesRef.child(fileName);

  // // File path is 'images/space.jpg'
  // var path = spaceRef.fullPath;

  // // File name is 'space.jpg'
  // var name = spaceRef.name;

  // // Points to 'images'
  // var imagesRef = spaceRef.parent;

  return storageRef;
}



// ---------------------
// firestore から、情報を取得
// ---------------------
function fetchAllMentors(){
  return new Promise((resolve, reject) => {
    let mentors = [];
    db.collection("mentors").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var mentor = doc.data();
        if(mentor != undefined){
          mentor["urlParam"] = doc.id;
          mentors.push(mentor);
        }
      });
      resolve(mentors);
    }).catch((error) => {
      reject(error);
    });
  });
}

// ---------------------
// 認証関連の関数
// ---------------------

// ログイン状態の確認
function checkAuthState() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                reject(new Error('ログインしていません'));
            }
        });
    });
}

// セッションの永続化設定
function setPersistence() {
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
}

// パスワードリセットメールの送信
function sendPasswordResetEmail(email) {
    return firebase.auth().sendPasswordResetEmail(email);
}

// ログアウト
function signOut() {
    return firebase.auth().signOut();
}

// セッションタイムアウトの設定（30分）
const SESSION_TIMEOUT = 30 * 60 * 1000; // ミリ秒

// セッションタイムアウトの監視
let sessionTimeout;

function startSessionTimer() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        signOut().then(() => {
            window.location.href = 'login.html?timeout=true';
        }).catch((error) => {
            console.error('ログアウトエラー:', error);
        });
    }, SESSION_TIMEOUT);
}

// ユーザーアクションでセッションタイマーをリセット
function resetSessionTimer() {
    startSessionTimer();
}

// ページ読み込み時にセッションタイマーを開始
document.addEventListener('DOMContentLoaded', () => {
    // ユーザーアクションでセッションタイマーをリセット
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimer);
    });
    
    // 初期セッションタイマーを開始
    startSessionTimer();
});

// 入力値のバリデーション関数
function validateInput(input, type) {
  // XSS対策：HTMLエスケープ
  const escapedInput = input.replace(/[&<>"']/g, char => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[char];
  });

  // 入力タイプに応じたバリデーション
  switch (type) {
    case 'email':
      // メールアドレスの形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(escapedInput)) {
        throw new Error('有効なメールアドレスを入力してください');
      }
      break;

    case 'password':
      // パスワードの複雑さチェック
      if (escapedInput.length < 8) {
        throw new Error('パスワードは8文字以上で入力してください');
      }
      if (!/[A-Z]/.test(escapedInput)) {
        throw new Error('パスワードには大文字を含める必要があります');
      }
      if (!/[a-z]/.test(escapedInput)) {
        throw new Error('パスワードには小文字を含める必要があります');
      }
      if (!/[0-9]/.test(escapedInput)) {
        throw new Error('パスワードには数字を含める必要があります');
      }
      break;

    case 'text':
      // テキストの長さチェック
      if (escapedInput.length > 1000) {
        throw new Error('テキストは1000文字以内で入力してください');
      }
      break;

    case 'name':
      // 名前の形式チェック
      if (escapedInput.length < 2) {
        throw new Error('名前は2文字以上で入力してください');
      }
      if (escapedInput.length > 50) {
        throw new Error('名前は50文字以内で入力してください');
      }
      break;

    default:
      throw new Error('無効な入力タイプです');
  }

  return escapedInput;
}

// 特殊文字のエスケープ処理
function escapeSpecialChars(input) {
  return input.replace(/[&<>"']/g, char => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[char];
  });
}

// ログイン試行回数の管理
const MAX_LOGIN_ATTEMPTS = 5;  // 最大試行回数
const LOCKOUT_DURATION = 30 * 60 * 1000;  // ロックアウト時間（30分）

// ログイン試行回数を保存するオブジェクト
const loginAttempts = {
  count: 0,
  lastAttempt: null,
  lockedUntil: null
};

// ログイン試行回数をチェックする関数
function checkLoginAttempts(email) {
  const now = new Date().getTime();
  
  // ロックアウト期間が終了しているかチェック
  if (loginAttempts.lockedUntil && now > loginAttempts.lockedUntil) {
    // ロックアウト期間終了後はカウントをリセット
    loginAttempts.count = 0;
    loginAttempts.lockedUntil = null;
  }
  
  // アカウントがロックされているかチェック
  if (loginAttempts.lockedUntil && now <= loginAttempts.lockedUntil) {
    const remainingTime = Math.ceil((loginAttempts.lockedUntil - now) / 60000);
    throw new Error(`アカウントがロックされています。${remainingTime}分後に再試行してください。`);
  }
  
  return true;
}

// ログイン試行回数を更新する関数
function updateLoginAttempts(success) {
  const now = new Date().getTime();
  
  if (success) {
    // ログイン成功時はカウントをリセット
    loginAttempts.count = 0;
    loginAttempts.lastAttempt = null;
    loginAttempts.lockedUntil = null;
  } else {
    // ログイン失敗時はカウントを増やす
    loginAttempts.count++;
    loginAttempts.lastAttempt = now;
    
    // 最大試行回数を超えた場合はアカウントをロック
    if (loginAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      loginAttempts.lockedUntil = now + LOCKOUT_DURATION;
      throw new Error(`ログイン試行回数が上限を超えました。30分後に再試行してください。`);
    }
    
    // 残り試行回数を表示
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - loginAttempts.count;
    throw new Error(`ログインに失敗しました。あと${remainingAttempts}回試行できます。`);
  }
}

// パスワードの強度チェック強化
function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommon: !['password123', 'qwerty123', 'admin123'].includes(password.toLowerCase())
  };

  const strength = Object.values(checks).filter(Boolean).length;
  const messages = [];

  if (!checks.length) messages.push('パスワードは12文字以上必要です');
  if (!checks.uppercase) messages.push('大文字を含める必要があります');
  if (!checks.lowercase) messages.push('小文字を含める必要があります');
  if (!checks.numbers) messages.push('数字を含める必要があります');
  if (!checks.special) messages.push('特殊文字を含める必要があります');
  if (!checks.noCommon) messages.push('一般的なパスワードは使用できません');

  return {
    strength,
    isValid: strength >= 5,
    messages
  };
}

// ログイン履歴の記録
async function logLoginAttempt(userId, success, ipAddress, userAgent) {
  try {
    const loginLog = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      success,
      ipAddress,
      userAgent,
      userId: userId || null
    };

    await db.collection('loginHistory').add(loginLog);

    // ログイン履歴の保持期間を設定（90日）
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - 90);
    
    // 古いログの削除
    const oldLogs = await db.collection('loginHistory')
      .where('timestamp', '<', retentionDate)
      .get();
    
    const batch = db.batch();
    oldLogs.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('ログイン履歴の記録に失敗:', error);
  }
}

// アカウントロックアウト通知
async function sendLockoutNotification(userId, email) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // メール通知の送信
    const mailOptions = {
      to: email,
      subject: '【重要】アカウントロックアウトのお知らせ',
      text: `
        アカウントが一時的にロックされました。
        
        ロック解除時間: ${new Date(loginAttempts.lockedUntil).toLocaleString()}
        
        セキュリティ上の理由により、複数回のログイン失敗が検出されました。
        アカウントのセキュリティを確保するため、30分間のロックアウトを実施しています。
        
        このメールに心当たりがない場合は、至急パスワードの変更をお願いします。
      `
    };

    // Firebase Cloud Functionsを使用してメール送信
    await firebase.functions().httpsCallable('sendEmail')(mailOptions);

    // 管理者への通知
    const adminNotification = {
      userId,
      email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      type: 'account_lockout',
      status: 'pending'
    };

    await db.collection('securityAlerts').add(adminNotification);
  } catch (error) {
    console.error('ロックアウト通知の送信に失敗:', error);
  }
}

// ログイン処理の強化
async function enhancedLogin(email, password) {
  try {
    // 入力値のバリデーション
    const validatedEmail = validateInput(email, 'email');
    const validatedPassword = validateInput(password, 'password');
    
    // パスワードの強度チェック
    const passwordCheck = checkPasswordStrength(validatedPassword);
    if (!passwordCheck.isValid) {
      throw new Error(`パスワードが要件を満たしていません: ${passwordCheck.messages.join(', ')}`);
    }
    
    // ログイン試行回数をチェック
    checkLoginAttempts(validatedEmail);
    
    // ユーザーエージェントとIPアドレスの取得
    const userAgent = navigator.userAgent;
    const ipAddress = await fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => data.ip);
    
    // Firebase認証
    const userCredential = await firebase.auth().signInWithEmailAndPassword(validatedEmail, validatedPassword);
    
    // ログイン成功時の処理
    updateLoginAttempts(true);
    await logLoginAttempt(userCredential.user.uid, true, ipAddress, userAgent);
    await setPersistence();
    startSessionTimer();
    
    return userCredential.user;
  } catch (error) {
    // ログイン失敗時の処理
    updateLoginAttempts(false);
    await logLoginAttempt(null, false, ipAddress, userAgent);
    
    // アカウントロックアウト時の通知
    if (loginAttempts.lockedUntil) {
      await sendLockoutNotification(null, email);
    }
    
    throw error;
  }
}

// ユーザーロールの定義
const USER_ROLES = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  STUDENT: 'student'
};

// ユーザーロールの確認
async function checkUserRole(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data().role || USER_ROLES.STUDENT;
    }
    return USER_ROLES.STUDENT;
  } catch (error) {
    console.error('ロール確認エラー:', error);
    return USER_ROLES.STUDENT;
  }
}

// アクセス権限の確認
async function checkAccess(userId, requiredRole) {
  const userRole = await checkUserRole(userId);
  const roleHierarchy = {
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.MENTOR]: 2,
    [USER_ROLES.STUDENT]: 1
  };
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// メンター登録時の認証処理
async function registerMentor(userData) {
  try {
    // メールアドレスの重複チェック
    const existingUser = await db.collection('users')
      .where('email', '==', userData.email)
      .get();

    if (!existingUser.empty) {
      throw new Error('このメールアドレスは既に登録されています。');
    }

    // Firebase認証でユーザーを作成
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );

    // ユーザー情報をFirestoreに保存
    await db.collection('users').doc(userCredential.user.uid).set({
      email: userData.email,
      role: USER_ROLES.MENTOR,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      ...userData
    });

    return userCredential.user;
  } catch (error) {
    console.error('メンター登録エラー:', error);
    throw error;
  }
}

// セッション管理の強化
function setupSessionManagement() {
  // アクティビティ監視
  let lastActivity = Date.now();
  const ACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5分

  // アクティビティの更新
  function updateActivity() {
    lastActivity = Date.now();
  }

  // アクティビティチェック
  function checkActivity() {
    const now = Date.now();
    if (now - lastActivity > ACTIVITY_TIMEOUT) {
      signOut().then(() => {
        window.location.href = 'login.html?timeout=true';
      });
    }
  }

  // イベントリスナーの設定
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, updateActivity);
  });

  // 定期的なアクティビティチェック
  setInterval(checkActivity, 60000); // 1分ごとにチェック
}

// ページ読み込み時のセッション管理の初期化
document.addEventListener('DOMContentLoaded', () => {
  setupSessionManagement();
});
