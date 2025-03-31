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
