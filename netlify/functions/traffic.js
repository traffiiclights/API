"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

// Hafas
const createClient = require("hafas-client");
const vvtProfile = require("hafas-client/p/vvt");
const client = createClient(vvtProfile, "api");

// moment
var moment = require("moment");

const calcMinutes = (from) => {
  var now = moment().utc().format("HH:mm");
  var dep = moment.utc(from);
  console.log(now + " " + dep)

  var dif = dep.subtract(now).format("mm");

  return dif;
};

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>This is the API from traficlights!</h1>");
  res.write(
    "<h2>Calls</h2><ul><li>https://trafficlightshtl.netlify.app/.netlify/functions/traffic/stops?search=query, in order to get all available stops with the specific ID. You have to pass a search query in the url</li><li>The app knows the ID of the target station: Just call https://trafficlightshtl.netlify.app/.netlify/functions/traffic/departures?id=476155700, in order to get the stops for the next 5 minutes</li></ul>"
  );
  res.end();
});

router.get("/test", (req, res) => {
  res.send("TESTSTRING");
});

router.get("/stops", async (req, res) => {
  const stops = await client.locations(req.query.search, {
    stops: true,
    poi: false,
    addresses: false,
    linesOfStops: true,
    results: 1,
  });
  console.log(stops);
  res.json({ station: req.query.search, stops: stops, amount: stops.length });
});

router.get("/departures", async (req, res) => {
  const departures = await client.departures(req.query.id, { duration: 5 });
  // console.log(departures);
  const resArr = [];
  departures.forEach((element) => {
    const oneDeparture = {};
    console.log(element.when)
    oneDeparture.when = calcMinutes(element.when);
    oneDeparture.line = element.line.name;
    oneDeparture.direction = element.direction;
    resArr.push(oneDeparture);
  });
  res.json({ stop: departures[0].stop.name, dept: resArr });
});

app.use("/.netlify/functions/traffic", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
