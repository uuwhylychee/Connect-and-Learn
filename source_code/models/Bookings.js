const mongoose = require('../db/db');

const bookingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    bookingTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now },
    status: { type: String, default: "confirmed" }, // 预约状态，如"pending", "confirmed", "cancelled"
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bookings', bookingsSchema);
