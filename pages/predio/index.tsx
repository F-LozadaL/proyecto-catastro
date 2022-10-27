import { Button, Divider, Form, Input } from "antd";
import React, { useEffect, useState } from 'react'
import PageLayout from "../../components/PageLayout";
import { prisma } from "../../lib/prisma";
import type { GetServerSideProps, NextPage } from 'next'
import Router from "next/router";
import { useRouter } from 'next/router';

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


                {/* ANT DESIGN FORM */}
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
                {/* ANT DESIGN FORM - END*/}

                <div>
                    <ul>
                        {predios.map(p => (
                            <li key={p.id}>
                                <div>
                                    <span>{p.department}</span>
                                    <span>{p.city}</span>
                                    <span>{p._count.buildings}</span>
                                    <span>{p._count.owner}</span>
                                    <Button htmlType="button" onClick={() => { deletePredio(p.id) }}>X</Button>
                                    <Button htmlType="button" href={`/predio/${p.id}/edit`} >Edit</Button>
                                    <Button htmlType="button" href={`/predio/${p.id}/buildings`}>Editar Construcciones</Button>
                                    <Button htmlType="button" href={`/predio/edit/${p.id}`}>Editar Terreno</Button>
                                    <Button htmlType="button" href={`/predio/${p.id}/owners`}>Editar Dueños</Button>
                                    <Divider />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
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