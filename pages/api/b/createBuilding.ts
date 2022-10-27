
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

async function postConstruccion(req: NextApiRequest, res: NextApiResponse) {
    console.log("req.body", req.body)
    const { area_m2, type, floors, address } = req.body;

    try {
        await prisma.construccion.create({
            data: {
                area_m2: area_m2,
                type: type,
                floors: floors,
                address: address
            }
        })
        res.status(200).json({ message: 'Propietario Creado' })
    } catch (err) {
        console.error(err)
    }
}

export default postConstruccion;