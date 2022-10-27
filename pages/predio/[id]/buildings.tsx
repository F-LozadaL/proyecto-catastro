import { Button, Divider, Form, Input, Select } from "antd";
import Item from "antd/lib/list/Item";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";

import { prisma } from "../../../lib/prisma";

const { Option } = Select;

interface Building {
    buildings: {
        id: number,
        area_m2: number,
        type: string,
        floors: number,
        address: string
    }[]
}

interface FormData {
    predioId: number,
    buildingId: number
}


// ANT DESIGN STUFF -END

const Predio: NextPage<Building> = ({ buildings }) => {

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



    async function addConstruccion(data: FormData) {
        try {
            await fetch('http://localhost:3000/api/p/addBuilding', {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })
            refreshData()
        } catch (error) {
            console.log(error);
        }
    }

    async function removeBuilding(buildingId: number) {
        const body = {
            predioId: Number(id),
            buildingId: buildingId
        }
        try {
            await fetch(`http://localhost:3000/api/p/removeBuilding`, {
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

        data.predioId = Number(id);
        data.buildingId = Number(data.buildingId)
        try {
            form.resetFields();
            addConstruccion(data)
            // refreshData()
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
                name="add-building"
                initialValues={{ id: id }}
                onFinish={onFinish}
            >
                <Form.Item label='ID Construccion' name='buildingId' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Divider />

            <Divider />


            <div>
                <ul>
                    {buildings.map(b => (
                        <div key={b.id}>
                            <li >
                                <span>{b.id}</span>
                                <span>{b.type}</span>
                                <span>{b.area_m2}</span>
                                <span>{b.floors}</span>
                                <Button htmlType="button" onClick={() => { removeBuilding(b.id) }}>X</Button>
                                <Button htmlType="button" href={`/building/${b.id}/edit`}>Editar</Button>

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

    const buildingsa = await prisma.predio.findUnique({
        where: {
            id: predioId
        },
        select: {
            buildings: true
        }
    })
    const buildings = buildingsa?.buildings
    return {
        props: {
            buildings
        }
    }
}

export default Predio;