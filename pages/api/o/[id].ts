import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const propietarioId = req.query.id;
    console.log(req.body)

    switch (req.method) {


        case 'DELETE':
            deletePropietario(res, propietarioId);
            break;
        case 'PUT':
            putPropietario(req, propietarioId);
            break;
        default:

            break;
    }
}


async function deletePropietario(res: NextApiResponse, predioId: string | string[] | undefined) {

    const predio = await prisma.predio.delete({
        where: { id: Number(predioId) }
    })
    res.json(predio)

}
async function putPropietario(req: NextApiRequest, predioId: string | string[] | undefined) {

    const { appraise, department, city } = req.body;
    try {
        const predio = await prisma.predio.update({
            where: {
                id: Number(predioId)
            },
            data: {
                appraise: req.body.appraise,
                department: req.body.department,
                city: req.body.city
            }
        })
    } catch (error) {
        console.error(error)
    }

}