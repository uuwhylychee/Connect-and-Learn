const mongoose = require("../db/db");
const FileSchema = new mongoose.Schema({
    file: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("File", FileSchema);
