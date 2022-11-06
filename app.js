require("dotenv").config();
const express = require("express");
const app = express();
const bp = require("body-parser");
const qr = require("qrcode");
const axios = require('axios');

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/scan", (req, res) => {
  const url = req.body.url;

  // If the input is null return "Empty Data" error
  if (url.length === 0) res.send("Empty Data!");

  // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
  // It shall be returned as a png image format
  // In case of an error, it will save the error inside the "err" variable and display it

  qr.toDataURL(url, (err, src) => {
    if (err) res.send("Error occured");

    // Let us return the QR code image as our response and set it to be the source used in the webpage
    res.render("scan", { src });
  });
});
app.get('/scan-url/:url', (req, res) => {
  const url = req.params.url;
  console.log(url)
  /******************************************* */
  const encodedParams = new URLSearchParams();
  encodedParams.set('apikey', 'fe9991119885a6cd25b157ddf49da18f2460c723b7fff8d2127bbec3d97129a8');
  encodedParams.set('url', url);

  const optionsScan = {
    method: 'POST',
    url: 'https://www.virustotal.com/vtapi/v2/url/scan',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodedParams,
  };
  /************************************ */
  axios
    .request(optionsScan)
    .then(function (response) {
      return response.data;
    })
    .then(data => {
      const optionsReport = {
        method: 'GET',
        url: 'https://www.virustotal.com/vtapi/v2/url/report',
        params: {
          apikey: process.env.APIKEY,
          resource: data.url,
          allinfo: 'false',
          scan: '0'
        },
        headers: { accept: 'application/json' }
      };
      axios
        .request(optionsReport)
        .then(function (response) {
          console.log(response.data);
          res.send(JSON.stringify(response.data.scans))
        })
    })
    .catch(function (error) {
      console.error(error);
    });


})
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server at 5000"));
