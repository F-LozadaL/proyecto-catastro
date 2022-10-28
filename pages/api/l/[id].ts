import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const terrenoId = req.query.id;

    switch (req.method) {


        case 'DELETE':
            deleteTerreno(terrenoId);
            res.status(200).json({ message: 'Terreno Borrado' })
            break;
        case 'PUT':
            putTerreno(req);
            res.status(200).json({ message: 'Terreno Actualizada' })
            break;
        default:

            break;
    }
}


async function deleteTerreno(landId: string | string[] | undefined) {

    await prisma.terreno.delete({
        where: { id: Number(landId) }
    })

}
async function putTerreno(req: NextApiRequest) {
    const { area_m2, value, water, territory_type, Buildings } = req.body;
    const landId = req.query.id;
    try {
        await prisma.terreno.update({
            where: {
                id: Number(landId)
            },
            data: {
                area_m2: area_m2,
                value: value,
                water: water,
                territory_type: territory_type,
                Buildings: Buildings
            }
        })

    } catch (error) {
        console.error(error)
    }

}