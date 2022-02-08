"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

// Webuntis
const WebUntisLib = require("webuntis");
const untis = new WebUntisLib.WebUntisAnonymousAuth(
  "htl1-innsbruck",
  "neilo.webuntis.com"
);

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>This is the API from traficlights!</h1>");
  res.end();
});

router.get("/classes", async (req, res) => {
  await untis.login();
  const classes = await untis.getClasses();
  const index = classes.findIndex(function (item, i) {
    return item.name === req.query.name;
  });
  res.json({ class: classes[index] });
});

router.get("/timetableToday", async (req, res) => {
  await untis.login();
  const timetable = await untis.getTimetableForToday(
    req.query.id,
    WebUntisLib.TYPES.CLASS
  );
  const resArr = [];

  timetable.forEach((element) => {
    if (element.code) {
      let oneObj = {};
      switch (element.code) {
        case "cancelled":
          oneObj.type = "cancelled";
          break;
        case "irregular":
          oneObj.type = "irregular";
          break;
      }
      oneObj.subject = element.su[0].longname;
      oneObj.short = element.su[0].name;
      oneObj.start = element.startTime;
      oneObj.end = element.endTime;

      resArr.push(oneObj);
    }
  });

  res.json({ class: req.query.id, timetable: timetable, special: resArr });
});

router.get("/timetableWeek", async (req, res) => {
  await untis.login();
  const timetable = await untis.getTimetableForRange(
    WebUntisLib.convertUntisDate("2022-01-18"),
    WebUntisLib.convertUntisDate("2022-01-25"),
    req.query.id,
    WebUntisLib.TYPES.CLASS
  );
  const resArr = [];

  timetable.forEach((element) => {
    if (element.code) {
      let oneObj = {};
      switch (element.code) {
        case "cancelled":
          oneObj.type = "cancelled";
          break;
        case "irregular":
          oneObj.type = "irregular";
          break;
      }
      oneObj.subject = element.su[0].longname;
      oneObj.short = element.su[0].name;
      oneObj.start = element.startTime;
      oneObj.end = element.endTime;

      resArr.push(oneObj);
    }
  });

  res.json({ class: req.query.id, timetable: timetable, special: resArr });
});

app.use("/.netlify/functions/webuntis", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
