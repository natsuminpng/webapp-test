function listMentor(mentor, detailpage_link) {
  var list = document.getElementById('mentors-list');
  var mentor_box = document.createElement('li');
  mentor_box.classList.add('mentor-box');
  
  var mentor_profile = document.createElement('div');
  mentor_profile.classList.add('mentor-profile');

  var mentor_icon = document.createElement('img');
  mentor_icon.classList.add('mentor-icon');
  mentor_icon.src = mentor.アイコンURL || './app/image/mentor_icon.png';

  var mentor_name = document.createElement('h1');
  mentor_name.classList.add('mentor-name');
  var link = document.createElement('a');
  link.href = detailpage_link;
  link.textContent = mentor.氏名;
  mentor_name.appendChild(link);

  mentor_profile.appendChild(mentor_icon);
  mentor_profile.appendChild(mentor_name);
  mentor_box.appendChild(mentor_profile);

  var mentor_info = document.createElement('div');
  mentor_info.classList.add('mentor-info');
  var ul = document.createElement('ul');
  var university = document.createElement('li');
  university.classList.add('university');
  university.textContent = mentor.出身大学;
  ul.appendChild(university);
  var graduate = document.createElement('li');
  graduate.classList.add('graduate');
  graduate.textContent = mentor.卒業した年;
  ul.appendChild(graduate);
  var industry = document.createElement('li');
  industry.classList.add('industry');
  industry.textContent = mentor.就職先業界;
  ul.appendChild(industry);

  mentor_info.appendChild(ul);
  mentor_box.appendChild(mentor_info);
  list.appendChild(mentor_box);
}
