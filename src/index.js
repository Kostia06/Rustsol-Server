const express = require("express");
const cors = require("cors");
require("dotenv").config();

const createOrder = require("./routes/createOrder");
const createPart = require("./routes/createPart");
const orderPaid = require("./routes/orderPaid");
const orderReady = require("./routes/orderReady");
const orderCompleted = require("./routes/orderCompleted");
const orderShipped = require("./routes/orderShipped");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// routes
app.use("/create-order", createOrder);
app.use("/create-part", createPart);
app.use("/order-paid", orderPaid);
app.use("/order-ready", orderReady);
app.use("/order-completed", orderCompleted);
app.use("/order-shipped", orderShipped);

app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});
