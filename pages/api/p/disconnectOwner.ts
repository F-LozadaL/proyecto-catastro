import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, ownerId } = req.body;




    try {
        await prisma.predio.update({
            where: {
                id: id
            },
            data: {
                owner: {
                    disconnect: [{ id: ownerId }]
                }
            }
        })
        res.status(200).json({ message: 'Predio Creado' })
    } catch (err) {
        console.error("No se pudo conectar a un propietario")
    }
}