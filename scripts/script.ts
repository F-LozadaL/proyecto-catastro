import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function main() {
    const propietario = await prisma.predio.create({
        data: {
            appraise: 500,
            name: "Kyle",
            department: "Meta",
            city: "Villavicencio"

        }
    })
    console.log(propietario)
}

main()
    .catch(e => {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })