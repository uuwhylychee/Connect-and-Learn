const express = require("express");
const router = express.Router();
const { authenticateToken, jwtSecret, sendObj } = require("../utils/index");
const Order = require("../models/Order");
const File = require("../models/File");

router.post("/order", authenticateToken, async (req, res) => {
    const timestamp = new Date().getTime();
    let orderNum = timestamp + (Math.floor(Math.random() * 9000) + 1000);

    const order = new Order({orderNum, icon: req.body.icon, status: 0});
    await order.save();

    res.status(200).send(sendObj(200, "", {orderNum}));
})

router.get("/order/:orderNum", (req, res, next) => {next();}, async (req, res) => {
    res.header({'Content-Type': 'text/html'});

    let order = await Order.findOneAndUpdate({orderNum: req.params.orderNum}, {status: 1});

    if (order) {
        if (order.status === 0) {
            let file = await File.findById(order.icon);

            res.status(200).send('<img src="' + file.file + '"/>');
        } else {
            res.status(200).send('<div>invalid code</div>');
        }
    } else {
        res.status(200).send('<div>Order does not exist</div>');
    }

})

module.exports = router;
