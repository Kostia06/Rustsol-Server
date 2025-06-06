const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { orderId } = req.body;
    console.log("🟢 Order Shipped for Order Id:", orderId);
    res.status(200).send("Received");
});

module.exports = router;
