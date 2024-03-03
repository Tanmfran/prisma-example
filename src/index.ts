import express from 'express';
import { PrismaClient } from '@prisma/client';
import {createDatabase} from "./db";

const bootstrapApp = async () => {
    await createDatabase()

    const prisma = new PrismaClient();
    const app = express();

    app.use(express.json());

    app.get('/forms/templates', async (req, res) => {
        const posts = await prisma.formTemplate.findMany()
        res.json(posts);
    });

    app.get('/health', async (req, res) => {
        return res.json({status: 'ok'})
    })

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

}

bootstrapApp()