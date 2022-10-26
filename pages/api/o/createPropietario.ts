
import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

async function postPropietario(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)
    const { id, id_type, names, lastnames, address, phone, person_type, NIT, business_name, email } = req.body;

    try {
        await prisma.propietario.create({
            data: {
                id,
                id_type,
                names,
                lastnames,
                address,
                phone,
                person_type,
                NIT,
                business_name,
                email
            }
        })
        res.status(200).json({ message: 'Propietario Creado' })
    } catch (err) {
        console.error(err)
    }
}

export default postPropietario;