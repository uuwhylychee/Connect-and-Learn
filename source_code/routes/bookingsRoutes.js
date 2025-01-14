const express = require("express");
const router = express.Router();
const { authenticateToken, jwtSecret, sendObj } = require("../utils/index");
const Bookings = require("../models/Bookings");
const Course = require("../models/Course");

const getCoursesByDate = (date, courses) => {
  return courses.filter(course => course.startWeek.toISOString().slice(0, 10) === date.toISOString().slice(0, 10));
};

// 获取预订的课程
router.get("/booking/my-booking", authenticateToken, async (req, res) => {
  // const { userId } = req.query;
  const userId = req.user.user._id;
  if (!userId) {
    return res.status(400).send('User ID is required');
  }
  try {
    const bookings = await Bookings.find({ userId: userId });
    // 准备课程详细信息的查询
    const courseIds = bookings.map(booking => booking.courseId.toString());

    // 获取所有课程的详细信息
    // 使用 sort() 方法按 startWeek 排序，-1 表示降序，1 表示升序
    const courses = await Course.find({ _id: { $in: courseIds } }).sort({ startWeek: 1 });

    // 获取今天的日期
    const today = new Date();
    today.setHours(23, 59, 59, 59); // 重置时间为当天的午夜

    // 获取今天的课程和未来的课程&已经上完的课
    const todayCourses = getCoursesByDate(today, courses);
    const futureCourses = courses.filter(course => course.startWeek > today);
    const doneCourses = courses.filter(course => course.startWeek < today);
    // 将课程详细信息与预订记录关联
    // const bookingsWithDetails = bookings.map(booking => {
    //   const todayCourses = _todayCourses.find(c => c._id.toString() === booking.courseId.toString());
    //   const futureCourses = _futureCourses.find(c => c._id.toString() === booking.courseId.toString());
    //   return { userId: booking.userId, courseId: booking.courseId, status: booking.status, todayCourses, futureCourses, };
    // });
    // const bookingsWithDetails = bookings.map(booking => {
    //   const course = courses.find(c => c._id.toString() === booking.courseId.toString());
    //   return { courseDetails: course };
    // });
    let obj = {
      allCourses: courses,
      todayCourses: todayCourses,
      futureCourses: futureCourses,
      doneCourses: doneCourses
    }
    res.status(200).send(sendObj(200, "", obj))
  } catch (error) {
    console.log("error", error)
    res.status(500).send('Error retrieving bookings');
  }
});

// 统计积分
router.get('/expired-courses', async (req, res) => {
  try {
    const database = db.db("yourDatabaseName");
    const coursesCollection = database.collection("courses");

    // 获取当前时间
    const now = new Date();

    // 查询所有开始时间早于当前时间的课程
    const expiredCourses = await coursesCollection.find({
      startWeek: { $lt: now }
    }).toArray();

    res.json({
      expiredCourses
    });
  } catch (error) {
    res.status(500).send('Error retrieving expired courses');
  }
});

module.exports = router;
