'use strict';
(function() {
  const API_URL = '/api/all/courses';

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
    let resgister = id("registered")
    for (let i = 0; i < rows.length; i++) {
        let courseName = rows[i]["courseName"];
        let li = document.createElement("li")
        let a = document.createElement("a");
        let button = document.createElement("button");
        button.id = "enroll" 
        button.innerText = "enroll";
        a.className = "post";
        a.innerText = courseName
        li.appendChild(a)
        li.appendChild(button)
        resgister.appendChild(li);
      }

        document.querySelectorAll("#enroll").forEach((e) => {
        e.addEventListener("click",enrollment);
        e.myParam = rows;
     });
  }
  function enrollment(e) {
      let target = e.target;
      let p = target.parentElement;
      let a = p.children[0].innerText;
      let rows = e.target.myParam;
      let CID = ""
      for(let i =0; i< rows.length; i++) {
        let courseName = rows[i]["courseName"];
          if(courseName == a){
            CID = rows[i]["courseID"];
          }
      }

      let formBody = new FormData();
      formBody.append("courseID",CID);
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
    if(result === "true"){
      alert("enroll successfully");
      window.location.href = 'allcourses.html';
    } else{
      alert("cannot not enroll course");
      window.location.href = 'allcourses.html';
    }
   
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
