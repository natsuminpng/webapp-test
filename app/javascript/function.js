// ---------------------
// メンター一覧に記載する、メンター１人分のBOXを追加
// ---------------------
function listMentor(mentor, email, password, detailpage_link) {
  var list = document.getElementById('mentors-list');
  var mentor_box = document.createElement('li');
  mentor_box.classList.add('mentor-box');
  
  var mentor_profile = document.createElement('div');
  mentor_profile.classList.add('mentor-profile');

  var mentor_icon = document.createElement('img');
  mentor_icon.classList.add('mentor-icon');
  login(email, password);
  getImgFromStorage(storageRef, mentor_icon);

  var mentor_name = document.createElement('h1');
  mentor_name.classList.add('mentor-name');
  var link = document.createElement('a');
  link.href = detailpage_link;
  link.textContent = mentor.mentor["氏名"];
  mentor_name.appendChild(link);

  mentor_profile.appendChild(mentor_icon);
  mentor_profile.appendChild(mentor_name);
  mentor_box.appendChild(mentor_profile);

  var mentor_info = document.createElement('div');
  mentor_info.classList.add('mentor-info');
  var ul = document.createElement('ul');
  var university = document.createElement('li');
  university.classList.add('university');
  university.textContent = mentor.mentor["出身大学"];
  ul.appendChild(university);
  var graduate = document.createElement('li');
  graduate.classList.add('graduate');
  graduate.textContent = mentor.mentor["卒業した年"];
  ul.appendChild(graduate);
  var job_category = document.createElement('li');
  job_category.classList.add('job-category');
  job_category.textContent = mentor.mentor["就職先業界"];
  ul.appendChild(job_category);

  mentor_info.appendChild(ul);
  mentor_box.appendChild(mentor_info);
  list.appendChild(mentor_box);
}



// ---------------------
// ---------------------