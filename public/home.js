'use strict';
(function() {
  const API_URL = 'http://localhost:8000/api/announcements';

  window.addEventListener('load', init);

  /**
   * TODO - setup the sign-in button on initial page load
   */
  function init() {
        fetch(API_URL,{
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
        })
        .then(statusCheck)
        .then(resp => resp.text())
        .then(addEntry)
        .catch(console.log);
    // TODO
  }

  /**
   * TODO
   * signIn - Signs the user in based on username and password inputs
   */

   function addEntry(rows) {
    rows = JSON.parse(rows)
      for (let i = 0; i < rows.length; i++) {
        let title = rows[i]["title"];
        let body = rows[i]["body"];
        let article = document.createElement("article")
        article.className = "post";
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        h3.innerText = title;
        p.innerText = body;
        article.appendChild(h3);
        article.appendChild(p);
        posts.appendChild(article);

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
    console.log(res)
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
