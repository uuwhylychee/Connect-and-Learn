const mongoose = require('../db/db');
const { ObjectId } = require('mongodb');

const messagesSchema = new mongoose.Schema({
    conversationId:{ type: ObjectId, default: new ObjectId() }, // 对话ID，关联同一主题下的留言和回复
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // 发送者ID（学生或管理员）
    title:String,
    content: String,
    type: { type: String, default: "message" }, // "message" 或 "reply"
    createdAt: { type: Date, default: Date.now },
    replyTo: { type: ObjectId, default: new ObjectId() } // 回复的消息ID，如果是直接留言则可能为空
});

module.exports = mongoose.model('Messages', messagesSchema);
