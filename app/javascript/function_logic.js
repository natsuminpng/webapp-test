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
