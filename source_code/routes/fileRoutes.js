const express = require("express");
const multer = require('multer');
const router = express.Router();
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const { authenticateToken, jwtSecret, sendObj } = require("../utils/index");
// 设置存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'author/');
  },
  filename: function (req, file, cb) {
    console.log("file", file)
    cb(null, Date.now() + "." + file.originalname.split(".")[1]);
  }
});

const upload = multer({ storage: storage });

// 文件上传接口
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send({
    msg: 'File uploaded successfully',
    file: req.file
  });
});


module.exports = router;
