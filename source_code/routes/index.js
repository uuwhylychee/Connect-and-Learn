const courseRoutes = require("./courseRoutes.js");
const userRoutes = require("./userRoutes.js");
const fileRoutes = require("./fileRoutes.js");
const bookingsRoutes = require("./bookingsRoutes.js");
const messageRoutes = require("./messageRoutes.js");
const orderRoutes = require("./orderRoutes.js");


module.exports = (app)=>{
	app.use(courseRoutes);
	app.use(userRoutes);
	app.use(fileRoutes);
	app.use(bookingsRoutes);
	app.use(messageRoutes);
	app.use(orderRoutes);
    // app.use('/user', userRoutes);
};
