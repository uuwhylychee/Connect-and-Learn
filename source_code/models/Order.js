const mongoose = require("../db/db");
const OrderSchema = new mongoose.Schema({
    orderNum: { type: String, required: true, unique: true },
    icon: { type: String, required: true, unique: false },
    status: { type: Number, required: true, unique: false }
});

module.exports = mongoose.model("Order", OrderSchema);
