// ---------------------
// メンター一覧に記載する、メンター１人分のBOXを追加
// ---------------------
function listMentor(mentor,email,password){
  console.log("ここからlistMentor")
  // console.log(mentor.menter[0]);

  // mentorを追加するコード
  var list = document.getElementById('mentors-list');

  // 追加する要素を作成
  // liの作成、追加
  var mentor_box = document.createElement('li');
  mentor_box.id = 'mentor-box';

  // console.log("1");

  // メンターのアイコンと名前を表示するところの作成、追加
  var mentor_profile = document.createElement('div');
  mentor_profile.id = 'mentor-profile';
  var mentor_icon = document.createElement('img');
  // mentor_icon.src = "./app/image/mentor_icon.png";// DBから取得
  mentor_icon.id = 'mentor-icon2';
  // 画像をstorageから取得して表示
  login(email, password);
  getImgFromStorage(storageRef,mentor_icon.id);

  // console.log("2");

  mentor_profile.appendChild(mentor_icon);
  var mentor_name = document.createElement('h1');
  mentor_name.id = 'mentor-name'
  mentor_name.textContent = mentor.menter[0]// DBから取得
  mentor_profile.appendChild(mentor_name);
  mentor_box.appendChild(mentor_profile);

  console.log("3");

  // メンターの情報を表示するところの作成、追加
  var mentor_info = document.createElement('div');
  mentor_info.id = 'mentor-info';
  var ul = document.createElement('ul');
  var university = document.createElement('li');
  university.id = 'university';
  university.textContent = mentor.menter[1]// DBから取得
  ul.appendChild(university);
  var graduate = document.createElement('li');
  graduate.id = 'graduate';
  graduate.textContent = mentor.menter[2]// DBから取得
  ul.appendChild(graduate);
  var job_category = document.createElement('li');
  job_category.id = 'job-category';
  job_category.textContent = mentor.menter[3]// DBから取得
  ul.appendChild(job_category);
  mentor_info.appendChild(ul);
  mentor_box.appendChild(mentor_info);

  list.appendChild(mentor_box);

  console.log("4");
  
}


// ---------------------
// ---------------------


// ---------------------
// ---------------------