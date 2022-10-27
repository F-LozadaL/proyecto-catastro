import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { buildingId, predioId } = req.body;

    try {
        await prisma.predio.update({
            where: {
                id: predioId
            },
            data: {
                buildings: {
                    disconnect: [{ id: buildingId }]
                }
            }
        })
        res.status(200).json({ message: 'Predio Creado' })
    } catch (err) {
        console.error("No se pudo conectar a un propietario")
    }
}