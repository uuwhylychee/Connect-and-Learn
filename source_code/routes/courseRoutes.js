const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { authenticateToken, jwtSecret, sendObj } = require("../utils/index");
const Bookings = require("../models/Bookings");

// 创建课程
router.post("/course/add", async (req, res) => {
  const newCourse = new Course(req.body);
  try {
    await newCourse.save();
    res.status(200).send(sendObj(200, "", newCourse));
    if (req.body.isRecurring) {
      scheduleRecurringCourse(newCourse);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});


// 定义循环创建课程的函数
function scheduleRecurringCourse(course) {
  const schedule = require('node-schedule');
  console.log("定时任务启动")
  const job = schedule.scheduleJob('0 0 1 * * ?', async () => {
    const currentWeek = new Date().getMonth() + 1; // 获取当前周数

    const weekdays = ['7', '1', '2', '3', '4', '5', '6'];
    const week = weekdays[new Date().getDay()];
    let weeks = course.weeks.split(',');

    if (course.startWeek <= currentWeek && currentWeek < course.endWeek && weeks.includes(week)) {
      const newCourse = new Course({
        name: course.name,
        startWeek: course.startWeek.setDate(course.startWeek.getDate() + 7),
        endWeek: course.endWeek.setDate(course.endWeek.getDate() + 7),
        isRecurring: course.isRecurring
      });
      await newCourse.save();
      // course.startWeek.setDate(7);
      // course.endWeek++;
      await course.save();
    }
  });

  // 可以添加逻辑来取消任务，例如当课程结束时
}


// 读取所有课程
router.post("/course/all", authenticateToken, async (req, res) => {
  try {
    const course = await Course.find();
    res.status(200).send(sendObj(200, "", course));
  } catch (err) {
    res.status(500).send(err);
  }
});


// 读取所有课程（可以添加查询参数进行过滤）
router.get("/course/list", authenticateToken, async (req, res) => {
  try {
    User.findById(req.user._id)
      .populate("courses")
      .then((user) => {
        res.json(user.courses);
      })
      .catch((err) => {
        res.status(500).json({ error: "Server error" });
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 更新课程（通过ID）
router.put("/course/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
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

// 删除课程（通过ID）
router.delete("/course/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).send("Course not found");
    res.status(200).send(sendObj(200, "", deletedCourse));
  } catch (err) {
    res.status(500).send(err);
  }
});

const isUserBooked = async (courseId, userId) => {
  const query = { courseId, userId };
  const result = await Bookings.findOne(query);
  return result !== null;
};

async function reserveCourse(courseId, userId) {
  if (await isUserBooked(courseId, userId)) {
    // 用户已预约
    return { success: false, message: 'You have already booked this course.' };
  }
  const course = await Course.find();
  const courseItem = course.find(c => c._id.toString() === courseId);

  if (!courseItem) {
    return { success: false, message: 'Course not found' };
  }
  if (courseItem.maxStudents <= 0) {
    return { success: false, message: 'Course is full' };
  }

  // 假设预约成功，减少课程容量
  courseItem.maxStudents--;

  // 更新课程容量
  await Course.findByIdAndUpdate(
    courseId,
    { $push: { bookedBy: userId } },
    { $set: { maxStudents: courseItem.maxStudents } },
    { new: true }
  );
  // 添加预约记录
  const bookings = new Bookings({
    userId,
    course: courseItem.title,
    courseId,
  });
  bookings.save();
  return { success: true, message: 'Reservation successful' };
}
// 课程预约
router.post("/course/book-course", authenticateToken, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.user._id;
  const result = await reserveCourse(courseId, userId);
  try {
    if (result.success) {
      res.status(200).send(sendObj(200, result.message, {}));
    } else {
      res.status(500).send(sendObj(-1, result.message, {}));
    }

  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
