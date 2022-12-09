'use strict';
(function() {
  const API_URL = '/api/announcements';

  window.addEventListener('load', init);

  function init() {
        fetch(API_URL,{
            method: "GET"
           
        })
        .then(statusCheck)
        .then(resp => resp.json())
        .then(addAnnouns)
        .catch(console.log);
  
  }

   function addAnnouns(rows) {
      let posts = document.getElementById("posts")
      for (let i = 0; i < rows.length; i++) {
        let title = rows[i]["title"];
        let body = rows[i]["body"];
        let div = document.createElement("div")
        div.className = "post";
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        h3.innerText = title;
        p.innerText = body;
        div.appendChild(h3);
        div.appendChild(p);
        posts.appendChild(div);

      }

  }
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();
