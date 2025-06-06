const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { createTemplateFor, sendEmail } = require("../utils");
const { order_confirmed_email, purchases_email } = require("../email");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
    const { user, order, parts } = req.body;

    try {
        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
        });

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Create order
        const createdOrder = await prisma.order.create({
            data: {
                userId: existingUser.id,
                shippingStreet: order.shippingStreet,
                shippingPostalCode: order.shippingPostalCode,
                shippingCity: order.shippingCity,
                shippingCountry: order.shippingCountry,
                status: order.status || "PENDING",
                paid: order.paid || false,
                orderParts: {
                    create: parts.map((part) => ({
                        partId: part.partId,
                        quantity: part.quantity,
                    })),
                },
            },
            include: {
                orderParts: true,
            },
        });
        const orderId = createdOrder.id;

        // 3. Generate emails
        const { html: reseller_customer_html, toEmail } =
            await createTemplateFor(orderId, "reseller-customer");

        const { html: supplier_html } = await createTemplateFor(
            orderId,
            "supplier",
            "LEMMER"
        );

        // Customer Email
        await sendEmail(
            order_confirmed_email,
            toEmail,
            "Invoice",
            reseller_customer_html
        );

        // Sales Confirmation Email
        await sendEmail(
            order_confirmed_email,
            process.env.EMAIL_TO_SALES_CONFIRMATION,
            `Sales Confirmation for Order ${orderId}`,
            reseller_customer_html
        );

        // Supplier Email
        await sendEmail(
            purchases_email,
            process.env.EMAIL_TO_LEMMER,
            `PO for Order ${orderId}`,
            supplier_html
        );

        res.json({
            message: "Order created and emails sent successfully",
            orderId,
        });
    } catch (error) {
        console.error("❌ Error handling order:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
