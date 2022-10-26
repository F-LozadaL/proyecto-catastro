import { Divider, Form } from "antd";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";

import { prisma } from "../../../lib/prisma";


interface Owner {
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

interface FormData {
    id: number
}

// ANT DESIGN STUFF
type LayoutType = Parameters<typeof Form>[0]['layout'];
const [forma] = Form.useForm();
const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

const formItemLayout =
    formLayout === 'horizontal'
        ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }
        : null;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

async function connectOwner(data: FormData) {
    try {
        fetch("http://localhost:3000/api/p/${id}",)
    } catch (error) {

    }
}

const onFinish = async (data: FormData) => {

    data.id = Number(data.id)
    try {
        forma.resetFields();
        connectOwner(data)
    } catch (error) {
        console.log(error)
    }
};
const onReset = () => {
    forma.resetFields();
};

// ANT DESIGN STUFF -END

const Predio: NextPage<Owner> = ({ owners }) => {

    return (
        <PageLayout>
            <Form>

            </Form>
            <Divider />
            <div>
                <ul>
                    {owners.map(o => (
                        <li>
                            <span> {o.names}</span>
                        </li>))}
                </ul>
            </div>
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

export default Predio;