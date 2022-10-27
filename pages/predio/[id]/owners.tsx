import { Button, Divider, Form, Input } from "antd";
import Item from "antd/lib/list/Item";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";

import { prisma } from "../../../lib/prisma";


interface Owner {
    owners: {
        id: number,
        id_type: string,
        names: string,
        lastnames: string,
        address: string,
        phone: string,
        person_type: string,
        NIT: number,
        business_name: string,
        email: string,
    }[]
}



interface FormData {
    id: number,
    ownerId: number
}



// ANT DESIGN STUFF -END

const Predio: NextPage<Owner> = ({ owners }) => {

    const router = useRouter();
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const { id } = router.query

    // ANT DESIGN STUFF
    type LayoutType = Parameters<typeof Form>[0]['layout'];
    const [form] = Form.useForm();
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
            await fetch(`http://localhost:3000/api/p/connectOwner`,
                {
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT'
                })
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    async function disconnectOwner(ownerId: number) {
        const body = {
            id: Number(id),
            ownerId: ownerId
        }
        try {
            await fetch(`http://localhost:3000/api/p/disconnectOwner`, {
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            })
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    const onFinish = async (data: FormData) => {
        data.id = Number(id);
        data.ownerId = Number(data.ownerId)
        try {
            form.resetFields();
            connectOwner(data)
        } catch (error) {
            console.log(error)
        }
    };
    const onReset = () => {
        form.resetFields();
    };


    return (
        <PageLayout>
            <Form
                {...formItemLayout}
                form={form}
                name="connect-owner"
                initialValues={{ id: id }}
                onFinish={onFinish}
            >
                <Form.Item label='ID Propietario' name='ownerId' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Divider />


            <div>
                <ul>
                    {owners.map(o => (
                        <div key={o.id}>
                            <li >
                                <span>{o.id}</span>
                                <span>{o.id_type}</span>
                                <span>{o.person_type}</span>
                                <span>{o.names}</span>
                                <Button htmlType="button" onClick={() => { disconnectOwner(o.id) }}>X</Button>
                                <Button htmlType="button" href={`/owner/${o.id}/edit`}>Editar</Button>
                            </li>
                            <Divider />
                        </div>
                    ))}
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

    const ownera = await prisma.predio.findUnique({
        where: {
            id: predioId
        },
        select: {
            owner: true,

        }
    })
    const owners = ownera?.owner
    return {
        props: {
            owners
        }
    }
}

export default Predio;