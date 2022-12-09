'use strict';
(function() {
  const API_URL = '/api/my/courses';

  window.addEventListener('load', init);

  function init() {
    fetch(API_URL,{
        method: "GET"
    })
    .then(statusCheck)
    .then(resp => resp.json())
    .then(addCourses)
    .catch(console.log);

  }
  
   function addCourses(datas) {
    const coursesContainer = document.querySelector(".courses-container");
    const displayCourse = (
      courseName,
      courseValue,
      thumbnailValue,
      descriptionValue,
      durationValue
    ) => {
      const card = document.createElement("div");
      card.classList.add("card");
    
      const a = document.createElement("a");
      a.id = "enter-course"
      a.setAttribute("href", "coursepage.html");
    
      const category = document.createElement("div");
      category.classList.add("category");
      category.innerHTML = courseValue;
    
      const img = document.createElement("img");
      img.setAttribute("src", thumbnailValue);
    
      const title = document.createElement("h2");
      title.classList.add("title");
      title.innerHTML = courseName;
    
      const description = document.createElement("div");
      description.classList.add("description");
      description.innerHTML = descriptionValue;
    
      const info = document.createElement("div");
      info.classList.add("info");
    
      const price = document.createElement("div");
      price.classList.add("price");
      price.innerHTML = "enrolled";
    
      const duration = document.createElement("div");
      duration.classList.add("duration");
    
      const timeIcon = document.createElement("div");
      timeIcon.classList.add("time-icon");
      timeIcon.innerHTML = `<svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clip-rule="evenodd"
      />
    </svg>`;
    
      const value = document.createElement("div");
      value.classList.add("value");
      value.innerHTML = durationValue;
    
      //   Appending Elements
    
      coursesContainer.appendChild(card);
      card.appendChild(a);
      a.appendChild(category);
      a.appendChild(img);
      a.appendChild(title);
      a.appendChild(description);
      a.appendChild(info);
      
      info.appendChild(price);
      info.appendChild(duration);
    
      duration.appendChild(timeIcon);
      duration.appendChild(value);
    };

      datas.forEach((c) => {
        displayCourse(
          c.courseName,
          c.course,
          c.thumbnail,
          c.description,
          c.duration
        );
      });
     document.querySelectorAll("#enter-course").forEach((e) => {
      e.addEventListener("click",enterCourse);
      e.myParam = datas;
   });
   document.getElementById("logout").addEventListener("click",logoutAcc);
  }
  function logoutAcc(){
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  }

function enterCourse(e){
  let target = e.target;
      let p = target.parentElement;
    let a = p.children[2].innerHTML;
      let datas = p.myParam;
      let CID = ""
    for(let i =0; i< datas.length; i++) {
      let courseName = datas[i]["courseName"];
        if(courseName == a){
          CID = datas[i]["courseID"];
        }
    }
    const d = new Date();
  d.setTime(d.getTime() + (7*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = "course_id" + "=" + CID + ";" + expires + ";path=/";
}

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();
