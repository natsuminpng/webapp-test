// ---------------------
// firestore から、情報を取得
// ---------------------
function getMentorData(doc_num,email,password){
  db.collection("TEST").doc(doc_num).onSnapshot((doc) => {
    // console.log("Current data: ", doc.data());

    var latestData = doc.data();
    console.log(latestData);
    
    if(latestData != undefined){
      listMentor(latestData,email,password);
    }
  });
}

// ---------------------
// メンター一覧に記載する、メンター１人分のBOXを追加
// ---------------------
function listMentor(latestData,email,password){
  // mentorを追加するコード
  var list = document.getElementById('mentors-list');

  // 追加する要素を作成
  // liの作成、追加
  var mentor_box = document.createElement('li');
  mentor_box.id = 'mentor-box';

  // メンターのアイコンと名前を表示するところの作成、追加
  var mentor_profile = document.createElement('div');
  mentor_profile.id = 'mentor-profile';
  var mentor_icon = document.createElement('img');
  // mentor_icon.src = "./app/image/mentor_icon.png";// DBから取得
  mentor_icon.id = 'mentor-icon2';
  // 画像をstorageから取得して表示
  login(email, password);
  getImgFromStorage(storageRef,mentor_icon.id);

  mentor_profile.appendChild(mentor_icon);
  var mentor_name = document.createElement('h1');
  mentor_name.id = 'mentor-name'
  mentor_name.textContent = latestData.menter[0]// DBから取得
  mentor_profile.appendChild(mentor_name);
  mentor_box.appendChild(mentor_profile);

  // メンターの情報を表示するところの作成、追加
  var mentor_info = document.createElement('div');
  mentor_info.id = 'mentor-info';
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
  job_category.id = 'job-category';
  job_category.textContent = latestData.menter[3]// DBから取得
  ul.appendChild(job_category);
  mentor_info.appendChild(ul);
  mentor_box.appendChild(mentor_info);

  list.appendChild(mentor_box);

  
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
// ---------------------


// ---------------------
// ---------------------