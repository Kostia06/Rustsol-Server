const express = require("express");
const router = express.Router();

const { createTemplateFor, sendEmail } = require("../utils");

router.post("/", async (req, res) => {
    const { orderId } = req.body;
    console.log("🚚 Order is Ready to be Shipped for Order Id:", orderId);
    const { html, toEmail } = await createTemplateFor(orderId, "order-ready");

    await sendEmail(
        process.env.EMAIL_ORDER_CONFIRMED_USERNAME,
        process.env.EMAIL_ORDER_CONFIRMED_PASSWORD,
        toEmail,
        `Order ${orderId} is Ready to be Shipped`,
        html
    );

    res.status(200).send("Received");
});

module.exports = router;
