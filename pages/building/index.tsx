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
    area_m2: number,
    type: string,
    floors: number,
    address: string
}

interface DataRow {
    id: number,
    area_m2: number,
    type: string,
    floors: number,
    address: string
}


const Building: NextPage<Building> = ({ buildings }) => {

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



    async function createConstruccion(data: FormData) {
        try {
            await fetch('http://localhost:3000/api/b/createBuilding', {
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

    async function deleteBuilding(buildingid: Number) {
        try {
            await fetch(`http://localhost:3000/api/b/${buildingid}`, {
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
        data.floors = Number(data.floors)
        try {
            form.resetFields();
            createConstruccion(data)
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
            <h1 >Crear Construccion</h1>
            <Form
                {...formItemLayout}
                form={form}
                name="create-predio"
                onFinish={onFinish}
            // initialValues={{

            // }}
            >
                <Form.Item label='Area (m²)' name='area_m2' rules={[{ required: true }]} >
                    <Input />
                </Form.Item>
                <Form.Item label='Tipo de Construccion' name='type' rules={[{ required: true }]}>
                    <Select
                        placeholder="Seleccione el Tipo de Construccion"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="INDUSTRIAL">Industrial</Option>
                        <Option value="COMERCIAL">Comercial</Option>
                        <Option value="RESIDENCIAL">Residencial</Option>
                    </Select>
                </Form.Item>

                <Form.Item label='Numero de Pisos' name='floors' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='Direccion' name='address' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Crear Construccion
                    </Button>
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>
            <Divider />


            <Table dataSource={buildings} rowKey="id">

                <Column title="Area (m²)" dataIndex="area_m2" key="area_m2" />
                <Column title="Tipo de Construccion" dataIndex="type" key="type" />

                <Column title="Numero de Pisos" dataIndex="floors" key="floors" />
                <Column title="Direccion" dataIndex="address" key="address" />

                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataRow) => (

                        <Space size="middle">
                            <Button onClick={() => { deleteBuilding(record.id) }} type="link">Delete</Button>

                        </Space>
                    )}
                />
            </Table>

        </PageLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const buildings = await prisma.construccion.findMany({

    })
    return {
        props: {
            buildings
        }
    }
}


export default Building;



