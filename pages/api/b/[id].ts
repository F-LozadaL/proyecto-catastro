import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const propietarioId = req.query.id;

    switch (req.method) {


        case 'DELETE':
            deleteConstruccion(propietarioId);
            res.status(200).json({ message: 'Construccion Borrada' })
            break;
        case 'PUT':
            putConstruccion(req);
            res.status(200).json({ message: 'Construccion Actualizada' })
            break;
        default:

            break;
    }
}


async function deleteConstruccion(buildingId: string | string[] | undefined) {

    await prisma.construccion.delete({
        where: { id: Number(buildingId) }
    })

}
async function putConstruccion(req: NextApiRequest) {
    const ownerId = req.query.id;
    const { area_m2, type, floors, address } = req.body;

    try {
        await prisma.construccion.update({
            where: {
                id: Number(ownerId)
            },
            data: {
                area_m2: area_m2,
                type: type,
                floors: floors,
                address: address
            }
        })

    } catch (error) {
        console.error(error)
    }

}