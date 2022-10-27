import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const propietarioId = req.query.id;
    console.log(req.body)

    switch (req.method) {


        case 'DELETE':
            deleteConstruccion(res, propietarioId);
            break;
        case 'PUT':
            putConstruccion(req, propietarioId);
            break;
        default:

            break;
    }
}


async function deleteConstruccion(res: NextApiResponse, ownerId: string | string[] | undefined) {

    const predio = await prisma.construccion.delete({
        where: { id: Number(ownerId) }
    })
    res.json(predio)

}
async function putConstruccion(req: NextApiRequest, ownerId: string | string[] | undefined) {

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