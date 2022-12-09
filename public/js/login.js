'use strict';
(function() {
  const API_URL = '/api/login';

  window.addEventListener('load', init);

  
  function init() {
    let action =  document.getElementById("form-sign-in");
    action.addEventListener('keypress', function(e){
      if(e.key === 'Enter'){
         e.preventDefault();
      let uname = document.getElementById("username").value;
      let pword = document.getElementById("password").value;
      signIn(uname,pword)
      }
    });
    action.addEventListener('submit', function(e){
        e.preventDefault();
        let uname = document.getElementById("username").value;
        let pword = document.getElementById("password").value;
        signIn(uname,pword)
      });

  }

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
  }
  function checkResult(result){
  if(result === "login successfully"){
       let s = 3;
       let load = document.getElementById("scanner")
       let span = document.createElement("span")
       span.innerHTML = "Loading..."
    let t = setInterval(function () {
        if (s == 3) {
          load.appendChild(span)
           s--;
        } else {
          s--;
          if(s ==0){
             clearInterval(t);
          setTimeout(() => {
              window.location.href = 'mycourses.html';
          }, 0);
          }
         
        }
    }, 1000);
  } else{
    alert(result);
    window.location.href = 'login.html';
  }
 
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();
