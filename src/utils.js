const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");
const juice = require("juice");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function loadTemplate(templateName, data) {
    const templatePath = path.join(
        __dirname,
        `../../templates/build_production/${templateName}.html`
    );
    const source = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(source);
    return juice(template(data)); // Inline CSS
}

function determinePricingField(role) {
    switch (role) {
        case "RESELLER":
            return "costWham2Reseller";
        case "CUSTOMER":
            return "costWham2Customer";
        case "LEMMER":
            return "costLemmer2Wham";
        default:
            throw new Error(`Unknown role: ${role}`);
    }
}

function addCommas(value) {
    const number = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(number)) return value; // Return original if not a valid number
    return number.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

async function createTemplateFor(orderId, templateName, overrideRole = null) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
            orderParts: {
                include: { part: true },
            },
        },
    });

    if (!order) throw new Error("Order not found");

    const pricingField = determinePricingField(overrideRole || order.user.role);

    const partMap = new Map();

    for (const op of order.orderParts) {
        const key = op.part.description;
        const quantity = op.quantity;
        const unitCost = op.part[pricingField];

        if (!partMap.has(key)) {
            partMap.set(key, {
                description: key,
                quantity: 0,
                unitCost,
                sumCost: 0,
            });
        }

        const item = partMap.get(key);
        item.quantity += quantity;
        item.sumCost += quantity * unitCost;
    }

    const orderParts = Array.from(partMap.values());
    const totalItemsCost = orderParts.reduce(
        (acc, item) => acc + item.sumCost,
        0
    );

    const html = loadTemplate(templateName, {
        orderId: order.id,
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        customer: {
            name: order.user.name,
            email: order.user.email,
            phone: order.user.phone,
            resellerName: order.user.resellerName,
            street: order.shippingStreet,
            postalCode: order.shippingPostalCode,
            city: order.shippingCity,
            country: order.shippingCountry,
        },
        order_paid: order.paid,
        wire_transfer: {
            bank_name: process.env.WIRE_TRANSFER_BANK_NAME,
            account_number: process.env.WIRE_TRANSFER_ACCOUNT_NUMBER,
            swift_bic: process.env.WIRE_TRANSFER_SWIFT_BIC,
            routing_number: process.env.WIRE_TRANSFER_ROUTING_NUMBER,
        },
        send_confirmation_to: process.env.SEND_CONFIRMATION_TO,
        orderParts: orderParts.map((p) => ({
            description: p.description,
            quantity: addCommas(p.quantity),
            unitCost: addCommas(p.unitCost.toFixed(2)),
            sumCost: addCommas(p.sumCost.toFixed(2)),
        })),
        shippingCost: addCommas("0.00"),
        tax: addCommas("0.00"),
        totalCost: addCommas(totalItemsCost.toFixed(2)),
        totalItemsCost: addCommas(totalItemsCost.toFixed(2)),
    });

    console.log();

    return { html, toEmail: order.user.email };
}

function writeTestFile(html, id) {
    const testFolder = path.join(__dirname, "../../test");
    if (!fs.existsSync(testFolder)) fs.mkdirSync(testFolder);

    const filePath = path.join(testFolder, `invoice-${id}.html`);
    fs.writeFileSync(filePath, html, "utf8");
    console.log(`📦 Invoice written to ${filePath}`);
}

async function sendEmail(email, to, subject, html) {
    console.log("📧 Sending email to:", to);
    const mailOptions = { from: email.from, to, subject, html };

    try {
        await email.transporter.sendMail(mailOptions);
        console.log("📨 Email sent to:", to);
    } catch (err) {
        console.error("❌ Email failed:", err.message);
        throw err;
    }
}

module.exports = {
    loadTemplate,
    writeTestFile,
    createTemplateFor,
    sendEmail,
};
