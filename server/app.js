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
    let db = await getDBConnection();
    let sql = "SELECT announid,title,body FROM Announcement;";
    let rows = await db.all(sql);
    await db.close();
    res.send(rows)
  } catch (error) {
    res.type("text");
    res.status(500).send("Something went wrong on the server.");
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
        let db = await getDBConnection();
        let sql = "SELECT userName FROM User WHERE userName = ? AND password = ?;";
        let rows = await db.all(sql, [user, pass]);
        await db.close();
      if (rows.length <= 0) {
        res.send("Incorrect Username and/or Password!");
      } else {
        let userName = rows[0]["username"];
        res.cookie("username", userName, { maxAge: 7 * 24 * 60 * 60 * 1000});
        res.send(true);
      }
    } catch {
      res.type("text");
      res.send("Something went wrong on the server.");
    }
  }
});
app.get("/api/my/courses", async function(req, res){
  if(req.cookies.username){
    try {
      let db = await getDBConnection();
      let sql = "SELECT * from Course where courseID in (SELECT courseID FROM myCourses INNER JOIN User on myCourses.userID = User.userID where username =?);";
      let rows = await db.all(sql,[req.cookies.username]);
      await db.close();
      res.json(rows)
    } catch (error) {
      res.type("text");
      res.status(500).send("Something went wrong on the server.");
    }
  } else{
    res.type("text");
    res.send("please login")
  }
});
app.get("/api/all/courses", async function(req, res){
  if(req.cookies.username){
    try {
      let db = await getDBConnection();
      let sql = "SELECT * from Course where courseID not in (SELECT courseID FROM myCourses INNER JOIN User on myCourses.userID = User.userID where username =?);";
      let rows = await db.all(sql,[req.cookies.username]);
      await db.close();
      res.json(rows)
    } catch (error) {
      res.type("text");
      res.status(500).send("Something went wrong on the server.");
    }
  } else{
    res.type("text");
    res.send("please login")
  }
});
app.post("/api/all/courses", async function(req, res){
  res.type("text");
  let username = req.cookies.username;
  let courseID = req.body.courseID;
  if(username){
      if ( courseID === undefined) {
    res.send("Missing required paramaters username or password.");
  } else {
    try {
       let userID = await getUserID(username)
       let dbs = await getDBConnection();
       let updateSql = 'Insert into myCourses VALUES (?,?);'
       await dbs.all(updateSql,[userID,courseID])
       await dbs.close();
     res.send(true)
    } catch {
      res.type("text");
      res.send("Something went wrong on the server.");
    }
  }
  }
});
app.post("/api/my/courses", async function(req, res){
  res.type("text");
  let username = req.cookies.username;
  let courseID = req.body.courseID;
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
      res.send("Something went wrong on the server.");
    }
  }
  }
});
app.post("/api/register", async function(req, res){
  res.type("text");
  let user = req.body.username;
  let pass = req.body.password;
  if (user === undefined || pass === undefined) {
    res.send("Missing required paramaters username or password.");
  } else {
    try {
        let db = await getDBConnection();
        let sql = "SELECT userName FROM User WHERE userName = ?;";
        let rows = await db.all(sql, [user]);
        await db.close(); 
      if (rows.length > 0) {
        res.send("Username is unavailable");
      } else {
        let dbs = await getDBConnection();
        let inserstSql = "INSERT INTO User (username, password ) VALUES (?,?);";
        await dbs.all(inserstSql , [user , pass])
        res.send("register successfully")
      }
    } catch {
      res.type("text");
      res.send("Something went wrong on the server.");
    }
  }
});
async function getUserID(username){
  let db = await getDBConnection();
  let sql = "select userID from user where username =?";
  let rows = await db.all(sql,username);
  await db.close();
  let userID = rows[0]['userID']
  return userID;
}
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "lms.db",
    driver: sqlite3.Database,
  });
  return db;
}

app.get("/api/course/:courseid/quizes", async function (req, res) {
  let username = req.cookies.username;
  if (username) {
    let courseid = req.cookies.course_id;
    if (courseid) {
      try {
        let db = await getDBConnection();
        let sql = "SELECT quizID, quizText,courseName FROM quizzes inner join course on quizzes.courseid = course.courseid WHERE quizzes.courseID = ?;";
        let rows = await db.all(sql, courseid);
        await db.close();
        if (rows.length === 0) {
          res.type("text");
          res.send("Currently no quizzes have been updated in the course!");
        } else res.json(rows);
      } catch {
        res.type("text");
        res.send("Something went wrong on the server.");
      }
    } else {
      res.type("text");
      res.send("Not Found course.");
    }
  } else {
    res.type("text");
    res.send("Please login to view this page!");
  }
});

app.get("/api/course/:courseid/doquiz/:quizid", async function (req, res) {
  let username = req.cookies.username;
  if (username) {
    let courseid = req.cookies.course_id;
    if (courseid) {
      let quizid =req.cookies.quiz_id;
      if (quizid) {
        try {
          let db = await getDBConnection();
          let questionQuery ="SELECT quizText, questionid, quesText from questions INNER JOIN quizzes ON questions.quizid = quizzes.quizid WHERE quizzes.quizid = ?;";
          let rowsQuestion = await db.all(questionQuery, quizid);
          let ansQuery = "SELECT answerid, answerText FROM answer a INNER JOIN questions q ON a.questionid = q.questionid WHERE q.questionid = ?;";
          for (let i = 0; i < rowsQuestion.length; i++) {
            let questionid = rowsQuestion[i]["questionid"];
            let dbs = await getDBConnection();
            let rowsAnswers = await dbs.all(ansQuery, questionid);
            let answer = "answer";
            rowsQuestion[i][answer] = [...rowsAnswers];
          }
          await db.close();
          res.json(rowsQuestion);
        } catch {
          res.type("text");
          res.send("Something went wrong on the server.");
        }
      } else {
        res.type("text");
        res.send("Not Found Quiz");
      }
    } else {
      res.type("text");
      res.send("Not Found course.");
    }
  } else {
    res.type("text");
    res.send("Please login to view this page!");
  }
});

app.post("/api/course/:courseid/doquiz/:quizid", async function (req, res) {
  let username = req.cookies.username;
  if (username) {
    let courseid = req.cookies.course_id;
    if (courseid) {
      let quizid = req.cookies.quiz_id;
      if (quizid) {
        try {
          let userChoice = req.body.answer;
          userChoice = JSON.parse(userChoice)
          let db = await getDBConnection();
          let correctAnsQuery ="SELECT questions.questionid as question_id, answerid as answer_id from answer inner join questions on answer.questionid = questions.questionid  WHERE correctAns = 1 and questions.quizid = ?;";
          let rowsCorrectAns = await db.all(correctAnsQuery,quizid);
          await db.close();
          let score = 0;
          for(let i = 0; i < rowsCorrectAns.length; i++) {
            for(let j = 0; j < userChoice.length; j++) {
                if(rowsCorrectAns[i]["question_id"] == userChoice[j]["question_id"]){
                  if(rowsCorrectAns[i]["answer_id"] == userChoice[j]["answer_id"]){
                    score++;
                  }
                }
            }
          }
         res.send(""+ score)
          // res.json(userChoice);
        } catch {
          res.type("text");
          res.send("Something went wrong on the server.");
        }
      } else {
        res.type("text");
        res.send("Not Found Quiz");
      }
    } else {
      res.type("text");
      res.send("Not Found course.");
    }
  } else {
    res.type("text");
    res.send("Please login to view this page!");
  }
});

const PORT = 8000;
app.listen(PORT);