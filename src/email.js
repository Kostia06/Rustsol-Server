const nodemailer = require("nodemailer");
require("dotenv").config();

const port = 587;
const host = "smtp.netfirms.com";

const order_confirmed_email = {
    from: process.env.EMAIL_ORDER_CONFIRMED_USERNAME,
    transporter: nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user: process.env.EMAIL_ORDER_CONFIRMED_USERNAME,
            pass: process.env.EMAIL_ORDER_CONFIRMED_PASSWORD,
        },
    }),
};

const purchases_email = {
    from: process.env.EMAIL_PURCHASES_USERNAME,
    transporter: nodemailer.createTransport({
        host,
        port,
        secure: false,
        auth: {
            user: process.env.EMAIL_PURCHASES_USERNAME,
            pass: process.env.EMAIL_PURCHASES_PASSWORD,
        },
    }),
};

module.exports = {
    order_confirmed_email,
    purchases_email,
};
