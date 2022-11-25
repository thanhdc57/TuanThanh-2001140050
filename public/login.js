'use strict';
(function() {
  const API_URL = '/api/login';

  window.addEventListener('load', init);

  /**
   * TODO - setup the sign-in button on initial page load
   */
  function init() {
    id("form-sign-in").addEventListener("submit", function(e){
        e.preventDefault();
        let uname = id("username").value;
        let pword = id("password").value;
        signIn(uname,pword)
        
      });
  
    // TODO
  }

  /**
   * TODO
   * signIn - Signs the user in based on username and password inputs
   */
   function signIn(u,p) {
    let formBody = new FormData();
    formBody.append("username",u);
    formBody.append("password",p);  
      fetch(API_URL,{
        method: "POST",
        body: formBody
      })
      .then(statusCheck)
      .then(resp => resp.text())
      .then(checkResult)
      .catch(console.log)
    //TODO
  }
  function checkResult(result){
  if(result === "true"){
       let s = 3;
    let t = setInterval(function () {
        if (s == 3) {
           alert("log in successful. You will be redirected to your courses page in 3s")
           s--;
        } else {
          s--;
          if(s ==0){
             clearInterval(t);
          setTimeout(() => {
              window.location.href = 'mycourses.html';
          }, 2000);
          }
         
        }
    }, 1000);
  } else{
    alert("incorrect username/password");
    window.location.href = 'login.html';
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
