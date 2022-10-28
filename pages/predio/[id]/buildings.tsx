import { Button, Divider, Form, Input, Select } from "antd";
import Item from "antd/lib/list/Item";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { Space, Table, Tag } from 'antd';
import { prisma } from "../../../lib/prisma";
import Link from "next/link";

const { Option } = Select;
const { Column, ColumnGroup } = Table;

interface Building {
    buildings: {
        id: number,
        area_m2: number,
        type: string,
        floors: number,
        address: string
    }[]
}

interface DataRow {
    id: number
}

interface FormData {
    predioId: number,
    buildingId: number
}

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
    // ANT DESIGN STUFF - END

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
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Agregar Construccion
                    </Button>
                </Form.Item>
            </Form>
            <Divider />

            <Table dataSource={buildings} rowKey="id">

                <Column title="Area (m²)" dataIndex="area_m2" key="area_m2" />
                <Column title="Tipo de Construccion" dataIndex="type" key="type" />
                <Column title="# Pisos" dataIndex="floors" key="floors" />
                <Column title="Direccion" dataIndex="address" key="address" />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataRow) => (
                        <Space size="middle">
                            <Button htmlType="button" onClick={() => { removeBuilding(record.id) }}>Desconectar</Button>
                            <Link href={`/building/${record.id}/edit`}>Editar</Link>
                        </Space>
                    )}
                />
            </Table>

            {/* <div>
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
            </div> */}
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