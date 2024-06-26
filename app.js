const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const vision = require("@google-cloud/vision");
const fs = require("fs");
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");
// const apiKeyMiddleware = require('./utils/apiKeyMiddleware')
const app = express();
app.use(express.json());

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./keyfile.json",
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization,On-behalf-of, x-sg-elas-acl"
  );
  next();
});
// app.use(apiKeyMiddleware)
app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    // const results = await cloudinary.uploader.upload(req.file.path, {
    //   tags: "liscences",
    //   folder: "liscences/",
    // });
    // imagePath = results.secure_url;
    const [result] = await client.textDetection(req.file.path);
    const ocrResult = result.textAnnotations[0].description;


    // const output = fs.appendFileSync(
    //   "output.txt",
    //   `${ocrResult}`,
    //   function (err) {
    //     if (err) throw err;
    //     console.log("OCR result saved to result.txt");
    //   }
    // );

    res.status(200).json({ status: "success", ocrResult ,split: ocrResult.split("\n")});
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
