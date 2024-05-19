// ---------------------
// firestore から、情報を取得
// ---------------------
function getMenterData(doc_num,email,password){
  db.collection("TEST").doc(doc_num).onSnapshot((doc) => {
    // console.log("Current data: ", doc.data());

    var latestData = doc.data();
    console.log(latestData);
    
    if(latestData != undefined){
      listMenter(latestData,email,password);
    }
  });
}

// ---------------------
// メンター一覧に記載する、メンター１人分のBOXを追加
// ---------------------
function listMenter(latestData,email,password){
  // menterを追加するコード
  var list = document.getElementById('menters_list');

  // 追加する要素を作成
  // liの作成、追加
  var menter_box = document.createElement('li');
  menter_box.id = 'menter_box';

  // メンターのアイコンと名前を表示するところの作成、追加
  var menter_profile = document.createElement('div');
  menter_profile.id = 'menter_profile';
  var menter_icon = document.createElement('img');
  // menter_icon.src = "./app/image/menter_icon.png";// DBから取得
  menter_icon.id = 'menter_icon2';
  // 画像をstorageから取得して表示
  login(email, password);
  getImgFromStorage(storageRef,menter_icon.id);

  menter_profile.appendChild(menter_icon);
  var menter_name = document.createElement('h1');
  menter_name.id = 'menter_name'
  menter_name.textContent = latestData.menter[0]// DBから取得
  menter_profile.appendChild(menter_name);
  menter_box.appendChild(menter_profile);

  // メンターの情報を表示するところの作成、追加
  var menter_info = document.createElement('div');
  menter_info.id = 'menter_info';
  var ul = document.createElement('ul');
  var university = document.createElement('li');
  university.id = 'university';
  university.textContent = latestData.menter[1]// DBから取得
  ul.appendChild(university);
  var graduate = document.createElement('li');
  graduate.id = 'graduate';
  graduate.textContent = latestData.menter[2]// DBから取得
  ul.appendChild(graduate);
  var job_category = document.createElement('li');
  job_category.id = 'job_category';
  job_category.textContent = latestData.menter[3]// DBから取得
  ul.appendChild(job_category);
  menter_info.appendChild(ul);
  menter_box.appendChild(menter_info);

  list.appendChild(menter_box);

  
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
// storage への接続
// ---------------------
function connectToStrage(){
  // storageとの接続
  // Points to the root reference
  var storageRef = firebase.storage().ref();

  // // Points to 'images'
  // var imagesRef = storageRef.child('images');

  // // Points to 'images/space.jpg'
  // // Note that you can use variables to create child values
  // var fileName = 'menter_icon2.png';
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
// storage から画像を取得
// ---------------------
function getImgFromStorage(storageRef,iconId){
  storageRef.child('menter_icon3.png').getDownloadURL()
    .then((url) => {
      // `url` is the download URL for 'menter_icon3.png'

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
      img.setAttribute('src', './app/image/menter_icon.png');
    });
}


// ---------------------
// storage から metaデータを取得
// ---------------------
function getMetadata(){
  // Create a reference to the file whose metadata we want to retrieve
  var forestRef = storageRef.child('menter_icon2.png');
  
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
// ---------------------


// ---------------------
// ---------------------