
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

async function postPropietario(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)
    const { area_m2, value, water, territory_type, Buildings } = req.body;

    try {
        await prisma.terreno.create({
            data: {
                area_m2,
                value,
                water,
                territory_type,
                Buildings
            }
        })
        res.status(200).json({ message: 'Terreno Creado' })
    } catch (err) {
        console.error(err)
    }
}

export default postPropietario;