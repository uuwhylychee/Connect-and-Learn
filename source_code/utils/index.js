// JWT密钥（实际应用中应使用环境变量或安全的方式存储）
const jwt = require("jsonwebtoken");
const jwtSecret = "asdasdkljk12342kjklacsdklasjdsakldjkq2342";

// 受保护的路由中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401).send({
      code: "-1",
      msg: "Unauthorized",
    });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403).send({
        code: "-1",
        msg: "token shixiao",
      });
    }
    req.user = user; // 将用户信息添加到请求对象中，以便在后续中间件或路由处理器中使用
    next();
  });
}

// 返回数据结构
const sendObj = (code = 200, msg = "", data = []) => {
  return { code, msg, data }
}

module.exports = { authenticateToken, jwtSecret, sendObj };
