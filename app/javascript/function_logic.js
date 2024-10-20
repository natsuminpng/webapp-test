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
    db.collection("TEST2").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var mentor = doc.data();
        if(mentor != undefined){
          mentor["urlParam"] = doc.id;
          mentors.push(mentor);
          // mentors.push({ID:{docID: doc.id}});  // これで、pushはできた
        }
        });
      resolve(mentors);
    }).catch((error) => {
      reject(error);
    });
  });
}



// ---------------------
// storage から画像を取得
// ---------------------
function getImgFromStorage(storageRef,iconId){
  storageRef.child('mentor_icon3.png').getDownloadURL()
    .then((url) => {
      // `url` is the download URL for 'mentor_icon3.png'

      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // Or inserted into an <img> element
      // id「iconId」に、図を挿入
      var img = document.getElementById(iconId);
      img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("エラーコード:", errorCode);
      console.log("エラーメッセージ:", errorMessage);
      var img = document.getElementById(iconId);
      img.setAttribute('src', './app/image/mentor_icon.png');
    });
}


// ---------------------
// storage から metaデータを取得
// ---------------------
function getMetadata(){
  // Create a reference to the file whose metadata we want to retrieve
  var forestRef = storageRef.child('mentor_icon2.png');
  
  // Get metadata properties
  forestRef.getMetadata()
    .then((metadata) => {
      // Metadata now contains the metadata for 'images/forest.jpg'
      console.log("getMetadata")
      console.log(metadata);
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log("getMetadata")
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("エラーコード:", errorCode);
      console.log("エラーメッセージ:", errorMessage);
    });  
}


// ---------------------
// Authentication のサインアップ
// ---------------------
function signup(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // 登録成功
      var user = userCredential.user;
      console.log("登録成功:", user);
    })
    .catch((error) => {
      // エラーハンドリング
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("エラーコード:", errorCode);
      console.log("エラーメッセージ:", errorMessage);
    });
}

// ---------------------
// Authentication のログイン
// ---------------------
// Authenticationでログイン
function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // ログイン成功
      var user = userCredential.user;
      console.log("ログイン成功:", user);
    })
    .catch((error) => {
      // エラーハンドリング
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("エラーコード:", errorCode);
      console.log("エラーメッセージ:", errorMessage);
    });
}



// ---------------------
// firestore から、メンターの詳細情報を取得
// ---------------------
// これ、失敗した関数。多分使わない
function fetchMentor(docId){
  // Firestoreの参照を取得
  var db = firebase.firestore();
  var docRef = db.collection("TEST2").doc(docId);

  return docRef.get().then((doc) => {
    if (doc.exists) {
      // ドキュメントデータを変数に格納
      var data = doc.data();
      var result = {
        id: data.ID,
        name: data.名前,
        gender: data.性別,
        almaMater: data.出身大学,
        majorSubject: data.専攻科目,
        affiliatedLab: data.所属研究室,
        phoneNumber: data.電話番号,
        address: data.住所
      };
      return result;
    } else {
      console.log("ドキュメントが存在しません");
      return null;
    }
  }).catch((error) => {
    console.log("エラー:", error);
    return null;
  });
}