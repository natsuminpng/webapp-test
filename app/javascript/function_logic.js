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
