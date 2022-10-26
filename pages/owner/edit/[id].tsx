import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import PageLayout from "../../../components/PageLayout";
import { prisma } from "../../../lib/prisma";

interface Owners {
    owners: {
        id: number,
        // id_type      : ,
        names: string,
        lastnames: string,
        address: string,
        phone: string,
        // person_type   ,
        NIT: number,
        business_name: string,
        email: string,
    }[]
}

const Owner: NextPage<Owners> = ({ owners }) => {


    return (
        <PageLayout>

        </PageLayout>
    )

}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    let predioId;
    if (ctx.params != undefined) {
        predioId = Number(ctx.params.id)
    } else {
        predioId = 0;
    }

    const owners = await prisma.propietario.findMany({
        where: {
            id: predioId
        }
    })

    return {
        props: {
            owners
        }
    }
}
export default Owner;

