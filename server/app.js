"use strict";
const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const multer = require("multer");
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
app.use(cookieParser())
app.use(express.json());
app.use(multer().none());
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', function(request, response) {
	// Render homepage template
  response.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get("/api/announcements", async function (req, res) {
  try {
    let database = await getDBConnection();
    let sqlShow = "SELECT announid,title,body FROM Announcement;";
    let datas = await database.all(sqlShow);
    await database.close();
    res.send(datas)
  } catch (error) {
    res.type("text");
    res.send("Error on the server");
  }
});

app.post("/api/login", async function (req, res) {
  res.type("text");
  let user = req.body.username;
  let pass = req.body.password;
  if (user === undefined || pass === undefined) {
    res.send("Missing required paramaters username or password.");
  } else {
    try {
        let database = await getDBConnection();
        let sqlShow = "SELECT userName FROM User WHERE userName = ? AND password = ?;";
        let datas = await database.all(sqlShow, [user, pass]);
        await database.close();
      if (datas.length <= 0) {
        res.send("Incorrect Username and/or Password!");
      } else {
        let username = datas[0]["username"];
        res.cookie("username", username, { maxAge: 7 * 24 * 60 * 60 * 1000});
        res.send("login successfully");
      }
    } catch {
      res.type("text");
      res.send("Error on the server");
    }
  }
});

app.post("/api/register", async function(req, res){
  res.type("text");
  let user = req.body.username;
  let pass = req.body.password;
  if (user === undefined || pass === undefined) {
    res.send("Missing required paramaters: username/password.");
  } else {
    try {
        let database = await getDBConnection();
        let sqlShow = "SELECT userName FROM User WHERE userName = ?;";
        let datas = await database.all(sqlShow, [user]);
        await database.close(); 
      if (datas.length > 0) {
        res.send("Username is unavailable");
      } else {
        let database1 = await getDBConnection();
        let inserstSql = "INSERT INTO User (username, password) VALUES (?,?);";
        await database1.all(inserstSql , [user , pass])
        res.send("register successfully")
      }
    } catch {
      res.type("text");
      res.send("Error on the server");
    }
  }
});

app.get("/api/my/courses", async function(req, res){
  if(req.cookies.username){
    try {
      let database = await getDBConnection();
      let sqlShow = "SELECT * from Course where courseID in (SELECT courseID FROM myCourses INNER JOIN User on myCourses.userID = User.userID where username =?);";
      let datas = await database.all(sqlShow,[req.cookies.username]);
      await database.close();
      res.json(datas)
    } catch (error) {
      res.type("text");
      res.send("Error on the server");
    }
  } else{
    res.type("text");
    res.send("please login to use this function")
  }
});

app.get("/api/all/courses", async function(req, res){
  if(req.cookies.username){
    try {
      let database = await getDBConnection();
      let sqlShow = "SELECT * from Course where courseID not in (SELECT courseID FROM myCourses INNER JOIN User on myCourses.userID = User.userID where username =?);";
      let datas = await database.all(sqlShow,[req.cookies.username]);
      await database.close();
      res.json(datas)
    } catch (error) {
      res.type("text");
      res.status(500).send("Error on the server");
    }
  } else{
    res.type("text");
    res.send("please login to use this function")
  }
});

app.post("/api/all/courses", async function(req, res){
  res.type("text");
  let username = req.cookies.username;
  let courseID = req.body.courseID;
  if(username){
      if (courseID === undefined) {
    res.send("Missing required paramaters username or password.");
  } else {
    try {
       let userID = await getUserID(username)
     
       let database = await getDBConnection();
       let updateSql = 'Insert into myCourses VALUES (?,?);'
       await database.all(updateSql,[userID,courseID])
       await database.close();
     res.send("enroll successfully")
    } catch {
      res.type("text");
      res.send("Error on the server");
    }
  }
  } else {
    res.type("text");
    res.send("please login to use this function")
  }
});

app.get("/api/course/:courseid/quizes", async function (req, res) {
  let username = req.cookies.username;
  if (username) {
    let courseid = req.params.courseid;
    if (courseid) {
      try {
        let database = await getDBConnection();
        let sqlShow = "SELECT quizID, quizText,courseName, course.courseID FROM quizzes inner join course on quizzes.courseid = course.courseid WHERE quizzes.courseID = ?;";
        let datas = await database.all(sqlShow, courseid);
        await database.close();
        if (datas.length === 0) {
          res.type("text");
          res.send("There are no quizz in this course");
        } else res.json(datas);
      } catch {
        res.type("text");
        res.send("Error on the server");
      }
    } else {
      res.type("text");
      res.send("Course Not Found");
    }
  } else {
    res.type("text");
    res.send("please login to use this function");
  }
});

app.post("/api/course/:courseid/quizes", async function(req, res){
  let username = req.cookies.username;
  let courseID = req.params.courseid;
  if(username){
      if ( courseID === undefined) {
    res.send("Missing required paramaters username or password.");
  } else {
    try {
      let userID = await getUserID(username)
       let dbs = await getDBConnection();
       let updateSql = 'Delete from myCourses where userID =? and courseID =?;'
       await dbs.all(updateSql,[userID,courseID])
       await dbs.close();
     res.send(true)
    } catch {
      res.type("text");
      res.send("Error on the server");
    }
  }
  } else {
    res.type("text");
    res.send("please login to use this function")
  }
});

app.get("/api/course/:courseid/doquiz/:quizid", async function (req, res) {
  let username = req.cookies.username;
  if (username) {
    let courseid = req.params.courseid;
    if (courseid) {
      let quizid =req.params.quizid;
      if (quizid) {
        try {
          let database = await getDBConnection();
          let sqlQuestion ="SELECT quizText, questionid, quesText from questions INNER JOIN quizzes ON questions.quizid = quizzes.quizid WHERE quizzes.quizid = ?;";
          let datasQuest = await database.all(sqlQuestion, quizid);
          let sqlAnswer = "SELECT answerid, answerText FROM answer a INNER JOIN questions q ON a.questionid = q.questionid WHERE q.questionid = ?;";
          for (let i = 0; i < datasQuest.length; i++) {
            let questionid = datasQuest[i]["questionid"];
            let dbs = await getDBConnection();
            let datasAnswer = await dbs.all(sqlAnswer, questionid);
            datasQuest[i]["answer"] = [...datasAnswer];
          }
          await database.close();
          res.json(datasQuest);
        } catch {
          res.type("text");
          res.send("Error on the server");
        }
      } else {
        res.type("text");
        res.send("Quiz Not Found");
      }
    } else {
      res.type("text");
      res.send("Course Not Found");
    }
  } else {
    res.type("text");
    res.send("please login to use this function");
  }
});

app.post("/api/course/:courseid/doquiz/:quizid", async function (req, res) {
  let username = req.cookies.username;
  if (username) {
    let courseid = req.params.courseid;
    if (courseid) {
      let quizid = req.params.quizid;
      if (quizid) {
        try {
          let userChoice = req.body.answer;
          userChoice = JSON.parse(userChoice)
          let database = await getDBConnection();
          let sqlCorrectAns ="SELECT questions.questionid as question_id, answerid as answer_id from answer inner join questions on answer.questionid = questions.questionid  WHERE correctAns = 1 and questions.quizid = ?;";
          let datasCorrectAns = await database.all(sqlCorrectAns,quizid);
          await database.close();
          let rightAns = 0;
          for(let i = 0; i < datasCorrectAns.length; i++) {
            for(let j = 0; j < userChoice.length; j++) {
                if(datasCorrectAns[i]["question_id"] == userChoice[j]["question_id"]){
                  if(datasCorrectAns[i]["answer_id"] == userChoice[j]["answer_id"]){
                        rightAns = rightAns + 1;
                  } 
                }
            }
          }
         res.send(rightAns + '')
        } catch {
          res.type("text");
          res.send("Error on the server");
        }
      } else {
        res.type("text");
        res.send("Quiz Not Found");
      }
    } else {
      res.type("text");
      res.send("Course Not Found");
    }
  } else {
    res.type("text");
    res.send("please login to use this function");
  }
});

async function getUserID(username){
  let database = await getDBConnection();
  let sqlShow = "select userID from user where username =?";
  let datas = await database.all(sqlShow,username);
  await database.close();
  let userID = datas[0]['userID']
  return userID;
}


async function getDBConnection() {
  const db = await sqlite.open({
    filename: "lms.db",
    driver: sqlite3.Database,
  });
  return db;
}

const PORT = 8000;
app.listen(PORT);