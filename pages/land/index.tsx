import { Button, Divider, Form, Input, Select } from "antd";
import Item from "antd/lib/list/Item";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";

import { prisma } from "../../lib/prisma";

import { Space, Table, Tag } from 'antd';
import React from 'react';
import Link from "next/link";

const { Column, ColumnGroup } = Table;

const { Option } = Select;

interface Land {
    lands: {
        id: number,
        area_m2: number,
        value: number,
        water: boolean,
        territory_type: string,
        Buildings: boolean
    }[]
}

interface FormData {
    area_m2: number,
    value: number,
    water: boolean,
    territory_type: string,
    Buildings: boolean
}

interface DataRow {
    id: number,
    area_m2: number,
    value: number,
    water: boolean,
    territory_type: string,
    Buildings: boolean
}


const Land: NextPage<Land> = ({ lands }) => {

    const router = useRouter();
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }

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



    async function createTerreno(data: FormData) {
        try {
            await fetch('http://localhost:3000/api/l/createLand', {
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

    async function deleteLand(landId: Number) {
        try {
            await fetch(`http://localhost:3000/api/b/${landId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            })
            refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    const onFinish = async (data: FormData) => {
        data.area_m2 = Number(data.area_m2)
        data.value = Number(data.value)
        try {
            form.resetFields();
            createTerreno(data)
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
                name="create-terreno"
                onFinish={onFinish}
            // initialValues={{

            // }}
            >
                <Form.Item label='Area (m²)' name='area_m2' rules={[{ required: true }]} >
                    <Input />
                </Form.Item>
                <Form.Item label='Tipo de Terreno' name='territory_type' rules={[{ required: true }]}>
                    <Select
                        placeholder="Seleccione el Tipo de Terreno"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="URBANO">Urbano</Option>
                        <Option value="RURAL">Rural</Option>
                    </Select>
                </Form.Item>

                <Form.Item label='Valor' name='value' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='Fuentes de Agua' name='water' rules={[{ required: true }]}>
                    <Select
                        placeholder="Esta cerca a fuentes de Agua?"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value={true} >Si</Option>
                        <Option value={false}>No</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Construcciones' name='Buildings' rules={[{ required: true }]}>
                    <Select
                        placeholder="Tiene Construcciones?"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value={true} >Si</Option>
                        <Option value={false}>No</Option>
                    </Select>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
            <Divider />


            <Table dataSource={lands} rowKey="id">
                area_m2: number,
                value: number,
                water: boolean,
                territory_type: string,
                Buildings: boolean
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
                            {/* <Button onClick={() => { deleteBuilding(record.id) }} type="link">Delete</Button> */}
                            <Link href={`/land/${record.id}/edit`}>Editar</Link>
                        </Space>
                    )}
                />

            </Table>

        </PageLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const lands = await prisma.terreno.findMany({

    })
    return {
        props: {
            lands
        }
    }
}


export default Land;



