const mongoose = require("../db/db");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  disabled: { type: Boolean, required: false, default: true },
  studentID: { type: String, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, require: false },
  author: { type: String, require: false, default: "author/moren.jpg" },
  role: { type: Number, default: 0, require: false }, //用户角色（如：'0:student', '1:admin' ，'2:tutor'）
  goals: { type: String, required: false, default: "" },
  difficulty: { type: String, required: false, default: "" },
  languages: { type: String, required: false, default: "" },
});

module.exports = mongoose.model("User", userSchema);
