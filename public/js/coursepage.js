'use strict';
(function() {
  window.addEventListener('load', init);


  function init() {
    let courseid = getValueOfCookie('course_id');
    fetch('/api/course/'+ courseid +'/quizes',{
        method: "GET"
    })
    .then(statusCheck)
    .then(resp => resp.json())
    .then(addQuizz)
    .catch(console.log);

  }

  function getValueOfCookie(name) {
    var nameOfCookie = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameOfCookie) == 0) return c.substring(nameOfCookie.length,c.length);
    }
    return null;
}
   function addQuizz(datas) {
    let quizz = document.getElementById("quizz")
    let heading = document.getElementById("course-name")
    heading.innerText = datas[0]["courseName"]
    for (let i = 0; i < datas.length; i++) {
        let quizName = datas[i]["quizText"];
        let li = document.createElement("li")
        let a = document.createElement("a");
        a.className = "listQuiz";
        a.href = "doquiz.html"
        a.id = "doquiz"
        a.innerText = quizName;
        li.appendChild(a)
        quizz.appendChild(li);
      }
      document.querySelectorAll("#doquiz").forEach((e) => {
        e.addEventListener("click",doQuiz);
        e.myParam = datas;
     });
          document.querySelectorAll("#leave").forEach((e) => {
        e.addEventListener("click",leaveCourse);
     });
     document.getElementById("logout").addEventListener("click",logoutAcc);

  }

  function logoutAcc(){
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  }
  function doQuiz(e) {
    let target = e.target;
    let p = target.parentElement;
    let a = p.children[0].innerText;
    let datas = e.target.myParam;
    let quiz_id = ""
    for(let i =0; i< datas.length; i++) {
      let quizText = datas[i]["quizText"];
        if(quizText == a){
          quiz_id = datas[i]["quizID"];
        }
    }
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = "quiz_id" + "=" + quiz_id + ";" + expires + ";path=/";
}
function leaveCourse() {
  let CID = getValueOfCookie('course_id')
  let formBody = new FormData();
  formBody.append("courseID",CID);
    fetch('/api/course/'+ CID +'/quizes',{
      method: "POST",
      body: formBody
    })
    .then(statusCheck)
    .then(resp => resp.text())
    .then(checkResult)
    .catch(console.log)
    document.cookie = "course_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


function checkResult(result){
  if(result === "true"){
    alert("leave course successfully");
    window.location.href = 'mycourses.html';
  } else{
    alert(result);
    window.location.href = 'mycourses.html';
  }
 
  } 

 
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();
