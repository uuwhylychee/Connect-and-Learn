const mongoose = require("../db/db");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher: String,
  // startTime: { type: Date, default: Date.now },
  // endTime: { type: Date, default: Date.now },
  startWeek: { type: Date, default: Date.now },
  endWeek: { type: Date, default: Date.now },
  weeks: { type: String },
  createdAt: { type: Date, default: Date.now },
  isRecurring: {type: Boolean},
  location: String,
  maxStudents: Number,
  bookedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", require: false }],
});

module.exports = mongoose.model("Course", courseSchema);
