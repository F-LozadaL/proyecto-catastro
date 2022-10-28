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

interface Land {
    land: {
        id: number,
        area_m2: number,
        value: number,
        water: boolean,
        territory_type: string,
        Buildings: boolean
    }
}

interface DataRow {
    id: number,
    landId: number,
    water: boolean,
    Buildings: boolean
}



interface FormData {
    id: number,
    landId: number
}



// ANT DESIGN STUFF -END

const Terreno: NextPage<Land> = (landa) => {

    const router = useRouter();
    // Call this function whenever you want to
    // refresh props!
    const land = landa.land
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const { id } = router.query

    // ANT DESIGN STUFF
    type LayoutType = Parameters<typeof Form>[0]['layout'];
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

    const [naturalHidden, setNaturalHidden] = useState<boolean>(true);


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
        data.id = Number(id);
        data.landId = Number(data.landId)
        try {
            form.resetFields();
            connectLand(data)
        } catch (error) {
            console.log(error)
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    // ANT DESIGN STUFF -END
    async function connectLand(data: FormData) {
        try {
            await fetch(`http://localhost:3000/api/p/connectLand`,
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

    async function disconnectLand(ownerId: number) {
        const body = {
            propertyId: Number(id),
            landId: ownerId
        }
        try {
            await fetch(`http://localhost:3000/api/p/disconnectLand`, {
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
                name="connect-land"
                onFinish={onFinish}
            >

                <Form.Item label='ID Terreno' name='landId' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Conectar Terreno
                    </Button>
                </Form.Item>
            </Form>
            <Divider />

            <Table dataSource={[land]} rowKey="id">

                <Column title="ID" dataIndex="id" key="id" />
                <Column title="Area (m²)" dataIndex="area_m2" key="area_m2" />
                <Column title="Valor" dataIndex="value" key="value" />
                <Column title="Tipo de Terreno" dataIndex="territory_type" key="territory_type" />
                <Column title="Fuentes de Agua" key="water"
                    render={(_: any, record: DataRow) => (
                        <Space>
                            <p>{String(record.water)}</p>
                        </Space>)} />
                <Column title="Construcciones" key="Buildings"
                    render={(_: any, record: DataRow) => (
                        <Space>
                            <p>{String(record.Buildings)}</p>
                        </Space>)} />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataRow) => (
                        <Space size="middle">
                            <Button htmlType="button" onClick={() => { disconnectLand(record.id) }}>Desconectar</Button>
                            <Link href={`/land/${record.id}/edit`}>Editar</Link>
                        </Space>
                    )}
                />
            </Table>

            {/* <div>
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
                        </div>
                    ))}
                </ul>
            </div> */}
        </PageLayout>

    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    let propertyId;
    if (ctx.params != undefined) {
        propertyId = Number(ctx.params.id)
    } else {
        propertyId = 0;
    }

    const landa = await prisma.predio.findUnique({
        where: {
            id: propertyId
        },
        select: {
            land: true,

        }
    })
    const land = landa?.land
    return {
        props: {
            land
        }
    }
}

export default Terreno;