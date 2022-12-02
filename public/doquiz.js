'use strict';
(function() {
  const API_URL = '/api/course/:courseid/doquiz/:quizid';

  window.addEventListener('load', init);

  function init() {
    id("quiz").addEventListener('submit', function(e){
      e.preventDefault();
     alert("cliked");
 });
    fetch(API_URL,{
        method: "GET"
    })
    .then(statusCheck)
    .then(resp => resp.json())
    .then(addEntry)
    .catch(console.log);

  }

   function addEntry(rows) {
    let quiz = id("quiz")
    let heading = id("quiz-name")
    heading.innerText = rows[0]["quizText"]

    for (let i = 0; i < rows.length; i++) {
        let question = rows[i]["quesText"];
        let answer = rows[i]["answer"];
        let div = document.createElement("div")
        let b = document.createElement("b");
        div.id = "listQues"
        b.className = "QuesName";
        b.innerText ="Question "+ (i+1) +": \n What is "+ question +"?";
        div.appendChild(b)
          for(let j = 0;j < answer.length;j++){
            let ans = answer[j]["answerText"]
            let p = document.createElement("p")
            let input = document.createElement("input")
           input.type = "radio"
           input.name = question
           input.value = ans
          input.className = "answer"
           p.appendChild(input)
            let a = document.createElement("a")
            a.innerText = ans
            a.id = "answer"
            a.className = ""
            a.style = "text-decoration: none; color: black"
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

      id("submit").addEventListener('click', function(e){
        e.preventDefault();
        e.myParam = rows;
        var answerText = document.forms[0];
        var txt = []
         var i;
      for (i = 0; i < answerText.length; i++) {
        if (answerText[i].checked) {
          let questionText = answerText[i].name
          let ansUser = answerText[i].value;
          txt.push({questionText: questionText, ansUser: ansUser})
       }
        }
        submit(e,txt)
   });
  }

  function submit(e,txt){
    let rows = e.myParam;
    let userChoice = []
    for(let i = 0; i < rows.length; i++) {
        for(let j = 0; j < txt.length; j++) {
          if(txt[j]["questionText"] == rows[i]["quesText"]){
            let question_id = rows[i]["questionid"]
            let answer = rows[i]["answer"]
            let answer_id = ""
            for(let k = 0; k <answer.length;k++){
              if(answer[k]["answerText"] == txt[j]["ansUser"]){
                answer_id = answer[k]["answerid"]
              }
            }
            userChoice.push({question_id: question_id, answer_id: answer_id})
          }
        }
  }
  userChoice = JSON.stringify(userChoice)
  let formBody = new FormData();
  formBody.append("answer",userChoice);
    fetch(API_URL,{
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
  console.log(score)
    Swal.fire({
      title:"Result",
      text:  "Your score: " + score + "/10",
      icon: "success"
    });
  } 

  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that has the matches the selector passed.
   * @param {string} selector - selector for element
   * @return {object} DOM object associated with selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();
