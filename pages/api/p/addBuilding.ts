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
                    connect: {
                        id: buildingId
                    }
                }
            }
        })
        res.status(200).json({ message: 'Construccion Agregada al Predio' })
    } catch (error) {
        console.error(error)
    }
}


