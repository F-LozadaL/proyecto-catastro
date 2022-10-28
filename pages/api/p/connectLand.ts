import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, landId } = req.body;
    try {
        await prisma.predio.update({
            where: {
                id: id
            },
            data: {
                land: {
                    connect: {
                        id: landId
                    }
                }
            }
        })
        res.status(200).json({ message: 'Terreno Conectado' })
    } catch (err) {
        console.error("No se pudo conectar con el Terreno introducido")
    }
}