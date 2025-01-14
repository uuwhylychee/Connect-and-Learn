const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { authenticateToken, jwtSecret, sendObj } = require("../utils/index");


// app.js (继续)
const initializeAdminUser = async () => {

  try {
    // 检查是否存在任何文档，如果不存在则初始化管理员用户
    const userExists = await User.findOne({ username: "admin" });
    if (!userExists) {
      const adminUser = {
        username: 'admin',
        password: 'admin', // 注意：实际应用中应该使用加密存储
        role: 'admin',
        email: "admin@163.com",
        disabled:false,
        studentID: "",
        author: "",
        role: 1,
        // 其他需要的字段...
      };
      const result = new User(adminUser);
      result.save()
      console.log('Admin user initialized:', result);
    } else {
      console.log('Users already exist.');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// 调用初始化函数
initializeAdminUser();

// 创建用户
router.post("/user/add", authenticateToken, async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(200).send(sendObj(200, "", newUser));
  } catch (err) {
    res.status(400).send(err);
  }
});

// 读取所有用户
router.post("/user/all", authenticateToken, async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(sendObj(200, "", user));
  } catch (err) {
    res.status(500).send(err);
  }
});

// 更新用户（通过ID）
router.put("/user/:id", authenticateToken, async (req, res) => {
  try {
    const updatedCourse = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCourse) return res.status(404).send("Course not found");
    res.status(200).send(sendObj(200, "", updatedCourse));
  } catch (err) {
    res.status(500).send(err);
  }
});

// 删除用户
router.delete("/user/:id", authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).send("User not found");
    res.status(200).send(sendObj(200, "", deletedUser));
  } catch (err) {
    res.status(500).send(err);
  }
});

// 用户登录
router.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: req.body.username });

    if (!user || user.password !== password) {
      return res.status(401).json(
        sendObj(-1, "Incorrect username or password")
      );
    }
    if (!user || user.disabled === true) {
      return res.status(401).json(
        sendObj(-1, "The account is not enabled, please contact the administrator to open it")
      );
    }
    // 生成JWT令牌
    const accessToken = jwt.sign({ user }, jwtSecret, { expiresIn: "7d" });
    // （可选）生成JWT刷新令牌并存储在数据库中
    // const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    // await User.updateOne({ _id: user._id }, { $push: { refreshTokens: { token: refreshToken, createdAt: new Date() } } });
    res.json({
      code: 200,
      token: accessToken,
      username,
      userInfo: user,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send(err);
  }
});
// 用户注册
router.post("/user/regist", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(200).send(sendObj(200, "", newUser));
  } catch (err) {
    res.status(400).send(err);
  }
});
// 用户退出
router.get("/user/logout", authenticateToken, async (req, res) => {
  // const { refreshToken } = req.body; // 假设客户端发送了refreshToken
  try {
    // 查找用户并更新其refreshTokens数组
    // const user = await User.findOneAndUpdate(
    //   { "refreshTokens.token": refreshToken },
    //   { $pull: { refreshTokens: { token: refreshToken } } },
    //   { new: true }
    // );

    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ message: "User not found or refresh token invalid" });
    // }

    res.status(200).json({ code: 200, message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ ode: -1, msg: "Error logging out", error });
  }
});

module.exports = router;
