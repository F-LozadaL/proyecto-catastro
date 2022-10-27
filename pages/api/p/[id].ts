import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const predioId = req.query.id;
    // console.log(req.body)

    switch (req.method) {
        case 'DELETE':
            deletePredio(res, predioId);
            break;
        case 'PUT':
            putPredio(req, predioId);
            break;
        default:

            break;
    }
}


async function deletePredio(res: NextApiResponse, predioId: string | string[] | undefined) {

    const predio = await prisma.predio.delete({
        where: { id: Number(predioId) }
    })
    res.json(predio)

}
async function putPredio(req: NextApiRequest, predioId: string | string[] | undefined) {

    const { appraise, department, city } = req.body;
    try {
        await prisma.predio.update({
            where: {
                id: Number(predioId)
            },
            data: {
                appraise: appraise,
                department: department,
                city: city
            }
        })
    } catch (error) {
        console.error(error)
    }

}