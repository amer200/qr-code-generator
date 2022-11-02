require("dotenv").config();
const express = require("express");
const app = express();
const bp = require("body-parser");
const qr = require("qrcode");
const urlscan = require('urlscan-api');
const apiKey = process.env.APIKEY;
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
  new urlscan().submit(apiKey, url).then(function (submitoutput) {
    res.status(200).send(JSON.stringify(submitoutput, null, 4))
    console.log(JSON.stringify(submitoutput, null, 4))
    console.log(url)

  })
    .catch(err => {
      console.log(err)
    })
})
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server at 5000"));
