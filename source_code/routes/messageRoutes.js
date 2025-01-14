const express = require("express");
const router = express.Router();
const { authenticateToken, jwtSecret, sendObj } = require("../utils/index");
const Messages = require("../models/Messages");
const User = require("../models/User");
const { ObjectId } = require('mongodb');


// GET 获取所有学生留言列表
router.get('/messages/all', authenticateToken, async (req, res) => {
  try {
    // const messages = await Messages.find().sort({ createdAt: 1 });
    const messages = await Messages.find({type:"message"}).sort({ createdAt: -1 });
    const results = messages.map(async item => {
      let user = await User.findOne({ _id: { $in: item.authorId.toString() } })
      return {
        userId: user._id,
        authorId: user._id,
        username: user.username,
        author: user.author,
        title: item.title,
        content: item.content,
        replyTo: item.replyTo,
        createdAt: item.createdAt,
        id: item._id,
        conversationId: item.conversationId,
      }
    })
    const resultsArray = await Promise.all(results);
    res.status(200).send(sendObj(200, "", resultsArray));
  } catch (error) {
    res.status(500).send(sendObj(-1, "", error.message));
  }
});


// GET 获取留言和回复接口
router.get('/conversations/:conversationId', async (req, res) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });
    const results = messages.map(async item => {
      let user = await User.findOne({ _id: { $in: item.authorId.toString() } })
      return {
        userId: user._id,
        authorId: user._id,
        username: user.username,
        author: user.author,
        title: item.title,
        type: item.type,
        content: item.content,
        replyTo: item.replyTo,
        createdAt: item.createdAt,
        id: item._id,
        conversationId: item.conversationId,
      }
    })
    const resultsArray = await Promise.all(results);
    res.status(200).send(sendObj(200, "", resultsArray));
    // res.status(200).send(sendObj(200, "Message sent successfully", messages));
  } catch (error) {
    res.status(500).send(sendObj(-1, 'Error fetching messages', error.message));
  }
});

// 发送留言
router.post("/messages/send", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { title, content } = req.body;
    const conversationId = new ObjectId(); // 生成新的对话ID
    const newMessage = {
      title: title,
      conversationId: conversationId,
      authorId: userId,
      content: content,
      type: 'message',
      replyTo: null
    };
    const result = await new Messages(newMessage);
    result.save();
    res.status(200).send(sendObj(200, "Message sent successfully", { messageId: result.insertedId }));
  } catch (error) {
    res.status(500).send(sendObj(-1, 'Error sending message', error.message));
  }
});

// 回复留言
router.post("/messages/reply", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user._id;
    // const { replyTo, content } = req.body;
    const { conversationId, content, replyTo } = req.body;
    const replyMessage = {
      conversationId: conversationId,
      authorId: userId,
      content: content,
      // type: replyTo ? 'reply' : 'message',
      type: 'reply',
      replyTo: replyTo || null
    };
    const result = await new Messages(replyMessage);
    result.save();
    res.status(200).send(sendObj(200, "Reply sent successfully", { messageId: result.insertedId }));
  } catch (error) {
    res.status(500).send(sendObj(-1, 'Error sending reply', error.message));
  }
});

module.exports = router;
