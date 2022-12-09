'use strict';
(function() {

  window.addEventListener('load', init);

  function init() {
    let courseid = getValueOfCookie('course_id')
    let quizid = getValueOfCookie('quiz_id')
    fetch('/api/course/'+ courseid +'/doquiz/'+ quizid,{
        method: "GET"
    })
    .then(statusCheck)
    .then(resp => resp.json())
    .then(addQuestions)
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
   function addQuestions(datas) {
    let quiz = document.getElementById("quiz")
    let heading = document.getElementById("quiz-name")
    heading.innerText = datas[0]["quizText"]
    for (let i = 0; i < datas.length; i++) {
        let question = datas[i]["quesText"];
        let answer = datas[i]["answer"];
        let div = document.createElement("div")
        let b = document.createElement("b");
        div.id = "listQuestion"
        b.className = "QuestName";
        b.innerText ="Question "+ (i+1) +": \n What is "+ question +"?";
        div.appendChild(b)
          for(let j = 0;j < answer.length;j++){
            let ans = answer[j]["answerText"]
            let p = document.createElement("p")
            let input = document.createElement("input")
           input.type = "radio"
           input.name = datas[i]["questionid"]
           input.value = answer[j]["answerid"]
          input.className = "answer"
           p.appendChild(input)
            let a = document.createElement("a")
            a.innerText = ans
            a.id = "answer"
            p.appendChild(a)  
            div.appendChild(p)
        }
        quiz.appendChild(div);
      }
      let inputBtn = document.createElement("input")
      inputBtn.type = "button" 
      inputBtn.name = ""
      inputBtn.value ="Submit"
      inputBtn.id = "submit"
      quiz.appendChild(inputBtn);

      document.getElementById("submit").addEventListener('click', function(e){
        e.preventDefault();
        var answerText = document.forms[0];
        var userChoice = []
         var i;
      for (i = 0; i < answerText.length; i++) {
        if (answerText[i].checked) {
          let questionid = answerText[i].name
          let answerid = answerText[i].value;
          userChoice.push({question_id: questionid, answer_id: answerid})
       }
        }
        submit(userChoice)
   });
   document.getElementById("logout").addEventListener("click",logoutAcc);

  }

  function logoutAcc(){
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  }

  function submit(userChoice){
    let courseid = getValueOfCookie('course_id')
    let quizid = getValueOfCookie('quiz_id')
  userChoice = JSON.stringify(userChoice)
  let formBody = new FormData();
  formBody.append("answer",userChoice);
    fetch('/api/course/'+ courseid +'/doquiz/'+ quizid,{
      method: "POST",
      body: formBody
    })
    .then(statusCheck)
    .then(resp => resp.text())
    .then(checkResult)
    .catch(console.log)
}
function checkResult(result){
  let score = result * 2
    Swal.fire({
      title: 'Result',
      text:  "Your score: " + score + "/10",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Do it again',
      cancelButtonText: 'Back to coursepage'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      } else{
        window.location.href = 'coursepage.html'
      }
    })
   
  } 

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }


})();
