// ---------------------
// メンター一覧に記載する、メンター１人分のBOXを追加
// ---------------------
function listMentor(mentor,email,password,detailpage_link){
  console.log("ここからlistMentor")

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
  mentor_icon.id = 'mentor-icon';

  // 画像をstorageから取得して表示
  login(email, password);
  getImgFromStorage(storageRef,mentor_icon.id);
  mentor_profile.appendChild(mentor_icon);

  // メンターの名前を表示するh1要素を作成
  var mentor_name = document.createElement('h1');
  mentor_name.id = 'mentor-name'

  // <a>タグを作成
  var link = document.createElement('a');
  // リンクのhref属性にURLとパラメータを設定
  link.href = detailpage_link;
  // リンクのテキストにメンターの名前を設定
  link.textContent = mentor.mentor["氏名"];

  // リンクをh1要素に追加
  mentor_name.appendChild(link);

  // mentor_name.textContent = mentor.mentor['氏名']// DBから取得
  mentor_profile.appendChild(mentor_name);
  mentor_box.appendChild(mentor_profile);

  // メンターの情報を表示するところの作成、追加
  var mentor_info = document.createElement('div');
  mentor_info.id = 'mentor-info';
  var ul = document.createElement('ul');
  var university = document.createElement('li');
  university.id = 'university';
  university.textContent = mentor.mentor["出身大学"]// DBから取得
  ul.appendChild(university);
  var graduate = document.createElement('li');
  graduate.id = 'graduate';
  graduate.textContent = mentor.mentor["卒業した年"]// DBから取得
  ul.appendChild(graduate);
  var job_category = document.createElement('li');
  job_category.id = 'job-category';
  job_category.textContent = mentor.mentor["就職先業界"]// DBから取得
  ul.appendChild(job_category);
  mentor_info.appendChild(ul);
  mentor_box.appendChild(mentor_info);

  list.appendChild(mentor_box);
  
}


// ---------------------
// ---------------------