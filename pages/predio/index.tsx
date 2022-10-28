import { Button, Divider, Form, Input } from "antd";
import React, { useEffect, useState } from 'react'
import PageLayout from "../../components/PageLayout";
import { prisma } from "../../lib/prisma";
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { Space, Table, Tag } from 'antd';
import Link from "next/link";

const { Column, ColumnGroup } = Table;

interface FormData {
    appraise: number,
    department: string,
    city: string
}

interface Predios {
    predios: {
        id: number,
        department: string,
        city: string,
        appraise: number
        _count: PrediosCount,
        lands: boolean
    }[]
}
interface PrediosCount {
    owner: number,
    buildings: number
}

interface DataRow {

    id: number,
    department: string,
    city: string,
    appraise: number
    _count: PrediosCount,
    lands: boolean

}



const Predio: NextPage<Predios> = ({ predios }) => {


    const router = useRouter();
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }

    async function createPredio(data: FormData) {
        try {
            await fetch('http://localhost:3000/api/p/createPredio', {
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
    async function deletePredio(id: Number) {
        try {
            await fetch(`http://localhost:3000/api/p/${id}`, {
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

    const onFinish = async (data: FormData) => {

        data.appraise = Number(data.appraise)
        try {
            forma.resetFields();
            createPredio(data)
        } catch (error) {
            console.log(error)
        }
    };
    const onReset = () => {
        forma.resetFields();
    };

    // ANT DESIGN STUFF -END
    return (
        <PageLayout title='Catastro - Registros'>
            <div>
                <h1 >Crear Predio</h1>

                <Form
                    {...formItemLayout}
                    form={forma}
                    name="create-predio"
                    onFinish={onFinish}
                >
                    <Form.Item label='Departamento' name='department' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Ciudad' name='city' rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Avaluo' name='appraise' rules={[{ required: true }]}>
                        <Input />
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
                <Table dataSource={predios} rowKey="id">

                    <Column title="Departamento" dataIndex="department" key="department" />
                    <Column title="Ciudad" dataIndex="city" key="city" />
                    <Column title="Avaluo" dataIndex="appraise" key="appraise" />
                    <Column title="Numero de Propietarios" key="address"
                        render={(_: any, record: DataRow) => (
                            <Space>
                                <p>{record._count.owner}</p>
                            </Space>)}
                    />
                    <Column title="Numero de Construcciones" key="buidlings"
                        render={(_: any, record: DataRow) => (
                            <Space>
                                <p>{record._count.buildings}</p>
                            </Space>)}
                    />
                    <Column
                        title="Action"
                        key="action"
                        render={(_: any, record: DataRow) => (
                            <Space size="middle">

                                <Link href={`/predio/${record.id}/edit`}>Editar</Link>
                                <Button htmlType="button" onClick={() => { deletePredio(record.id) }}>Delete</Button>
                                <Button htmlType="button" href={`/predio/${record.id}/buildings`}>Construcciones</Button>
                                <Button htmlType="button" href={`/predio/${record.id}/land`}>Terreno</Button>
                                <Button htmlType="button" href={`/predio/${record.id}/owners`}>Propietarios</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </PageLayout>
    )
}
export const getServerSideProps: GetServerSideProps = async () => {
    const predios = await prisma.predio.findMany({
        include: {
            _count: {
                select: {
                    owner: true,
                    buildings: true
                }
            }
        }
    })
    return {
        props: {
            predios
        }
    }
}
export default Predio;