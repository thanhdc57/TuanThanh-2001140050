'use strict';
(function() {
  const API_URL = '/api/register';

  window.addEventListener('load', init);

  function init() {
    let action =  document.getElementById("form-sign-up");
    action.addEventListener('keypress', function(e){
      if(e.key === 'Enter'){
         e.preventDefault();
         let username = document.getElementById("username").value;
         let password = document.getElementById("password").value;
         let confirmPass = document.getElementById("confirm-password").value;
         signUp(username,password,confirmPass);
      }
    });
    action.addEventListener('submit', function(e){
        e.preventDefault();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let confirmPass = document.getElementById("confirm-password").value;
        signUp(username,password,confirmPass);
      });
  
  }

   function signUp(u,p,cp) {
    if(u =='' || p == '' || cp == ''){
      alert("Please input a Value")
    } else if(p != cp){
        alert("wrong confirm password please enter password again")
        document.getElementById("password").value = "";
        document.getElementById("confirm-password").value = "";
    } else{
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
   
  }
  function checkResult(result){
  if(result === "register successfully"){
      alert("register successfully, please login to your account")
       window.location.href = 'login.html';
  } else{
    alert(result);
    window.location.href = 'register.html';
  }
 
  }
 
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();
