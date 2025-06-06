const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.post("/", async (req, res) => {
    const {
        description,
        costLemmer2Wham,
        costWham2Reseller,
        costWham2Customer,
        imageUrl,
    } = req.body;

    if (
        !description ||
        costLemmer2Wham === undefined ||
        costWham2Reseller === undefined ||
        costWham2Customer === undefined
    ) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const newPart = await prisma.part.create({
            data: {
                description,
                costLemmer2Wham,
                costWham2Reseller,
                costWham2Customer,
                imageUrl: imageUrl || "https://picsum.photos/200/300",
            },
        });

        res.json({ message: "Part created successfully", part: newPart });
    } catch (error) {
        console.error("❌ Error creating part:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
