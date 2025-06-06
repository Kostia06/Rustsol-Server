const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { orderId } = req.body;
    console.log("🟢 Order Completed for Order Id:", orderId);
    res.status(200).send("Received");
});

module.exports = router;
