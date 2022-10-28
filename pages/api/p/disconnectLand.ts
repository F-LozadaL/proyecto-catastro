import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { propertyId, landId } = req.body;




    try {
        await prisma.predio.update({
            where: {
                id: propertyId
            },
            data: {
                land: {
                    disconnect: landId
                }
            }
        })
        res.status(200).json({ message: 'Predio Creado' })
    } catch (err) {
        console.error("No se pudo conectar a un propietario")
    }
}