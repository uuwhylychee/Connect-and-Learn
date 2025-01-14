// db.js  
const mongoose = require('mongoose');  
  
const uri = "mongodb://localhost:27017/CourseAppointmentSystem"; // 替换为你的MongoDB数据库URI
  
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })  
    .then(() => console.log('MongoDB connected...'))  
    .catch(err => console.log(err));  
  
module.exports = mongoose;