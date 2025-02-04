const express = require("express");
const route = require('./routes/index');
const app = express();
const port = process.env.PORT || 3000;
// let session = require('express-session');
//后台配置跨域 （安全问题，改到前台去配）
// app.all('*', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//  res.header("X-Powered-By",' 3.2.1');
//  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
//  else  next();
// });
app.use(express.static('./dist'));

// app.use('/author',express.static('./server/author'));
app.use('/author',express.static('./author'));
app.use(express.json());
// app.use('/index', express.static(__dirname + '/../index.html'));

//session
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));
// app.get("/",(req,res,next)=>{
//   res.render("../index")
// });
//处理各种请求
route(app);

app.listen(port);
//暴露端口
exports.port = port;



