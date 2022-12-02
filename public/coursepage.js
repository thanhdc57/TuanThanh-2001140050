'use strict';
(function() {
  const API_URL = '/api/course/:courseid/quizes';

  window.addEventListener('load', init);

  /**
   * TODO - setup the sign-in button on initial page load
   */
  function init() {

    
    fetch(API_URL,{
        method: "GET"
    })
    .then(statusCheck)
    .then(resp => resp.json())
    .then(addEntry)
    .catch(console.log);

  
    // TODO
  }

  /**
   * TODO
   * signIn - Signs the user in based on username and password inputs
   */
   
   function addEntry(rows) {
    let quizz = id("quizz")
    let heading = id("course-name")
    heading.innerText = rows[0]["courseName"]
    for (let i = 0; i < rows.length; i++) {
        let quizName = rows[i]["quizText"];
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
        e.myParam = rows;
     });
  }
  function doQuiz(e) {
    let target = e.target;
    let p = target.parentElement;
    let a = p.children[0].innerText;
    let rows = e.target.myParam;
    let quiz_id = ""
    for(let i =0; i< rows.length; i++) {
      let quizText = rows[i]["quizText"];
        if(quizText == a){
          quiz_id = rows[i]["quizID"];
        }
    }
    const d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = "quiz_id" + "=" + quiz_id + ";" + expires + ";path=/";
}
// function checkResult(result){
//   if(result === "true"){
//     alert("leave course successfully");
//     window.location.href = 'mycourses.html';
//   } else{
//     alert("cannot not leave course");
//     window.location.href = 'mycourses.html';
//   }
 
//   } 

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
