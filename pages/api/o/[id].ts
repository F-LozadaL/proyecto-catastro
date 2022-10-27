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


async function deletePropietario(res: NextApiResponse, ownerId: string | string[] | undefined) {

    const propietario = await prisma.propietario.delete({
        where: { id: Number(ownerId) }
    })
    res.json(propietario)

}
async function putPropietario(req: NextApiRequest, ownerId: string | string[] | undefined) {

    const { id, id_type, names, lastnames, address, phone, person_type, NIT, business_name, email } = req.body;

    try {
        await prisma.propietario.update({
            where: {
                id: Number(ownerId)
            },
            data: {
                id: id,
                id_type: id_type,
                names: names,
                lastnames: lastnames,
                address: address,
                phone: phone,
                person_type: person_type,
                NIT: NIT,
                business_name: business_name,
                email: email
            }
        })
    } catch (error) {
        console.error(error)
    }

}