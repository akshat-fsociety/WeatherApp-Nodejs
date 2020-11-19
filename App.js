const http = require("http");
const fs = require("fs");
const { version } = require("os");
const requests = require("requests");
const path = require("path");
const express = require('express');
// const app = express();
// app.use(express.static(path.join(__dirname, '../public')));

//api = http://api.openweathermap.org/data/2.5/weather?q=lucknow&appid=b14425a6554d189a2d7dc18a8e7d7263

// using sync version
const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let indexData = tempVal.replace("{%tempval%}", orgVal.main.temp);
  indexData = indexData.replace("{%tempmin%}", orgVal.main.temp_min);
  indexData = indexData.replace("{%tempmax%}", orgVal.main.temp_max);
  indexData = indexData.replace("{%location%}", orgVal.name);
  indexData = indexData.replace("{%country%}", orgVal.sys.country);
  return indexData;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      //Under construction to CHANGE THE CITY NAME edit the query below (q=cityname)
      `http://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid=b14425a6554d189a2d7dc18a8e7d7263`
    )
      .on("data", (chunk) => {
        let objData = JSON.parse(chunk);
        let arrData = [objData];
        // console.log(arrData[0].main.temp);
        // res.end(chunk);
        let realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData)
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors");
        res.end();
      });
  } else {
    res.end("File not Found");
  }
});

server.listen(8000, "127.0.0.1");
