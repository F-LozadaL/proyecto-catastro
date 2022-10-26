import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { appraise, department, city } = req.body;
    try {
        await prisma.predio.create({
            data: {
                appraise,
                department,
                city
            }
        })
        res.status(200).json({ message: 'Predio Creado' })
    } catch (err) {
        console.error("error")
    }
}