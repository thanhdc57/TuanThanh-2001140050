"use strict";

const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(multer().none());
app.use(cookieParser());
app.use(cors({
  origin: '*'
}));
app.get("/api/announcements", async function (req, res) {
  try {
    let db = await getDBConnection();
    let sql = "SELECT announid,title,body FROM Announcement;";
    let rows = await db.all(sql);
    await db.close();
    res.json(rows)
  } catch (error) {
    res.type("text");
    res.status(500).send("Something went wrong on the server.");
  }
});

async function getDBConnection() {
  const db = await sqlite.open({
    filename: "lms.db",
    driver: sqlite3.Database,
  });
  return db;
}

const PORT = 8000;
app.listen(PORT);