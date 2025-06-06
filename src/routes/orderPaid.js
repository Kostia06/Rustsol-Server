const express = require("express");
const router = express.Router();

const { createTemplateFor, sendEmail } = require("../utils");

router.post("/", async (req, res) => {
    const { orderId } = req.body;

    res.status(200).send("Received");
});

module.exports = router;
