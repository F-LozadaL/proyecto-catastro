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

interface DataRow {
    id: number,
    id_type: string
}



interface FormData {
    id: number,
    ownerId: number
}



// ANT DESIGN STUFF -END

const Propietarios: NextPage<Owner> = ({ owners }) => {

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

    // ANT DESIGN STUFF -END
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

    const DocumentType = (type: string) => {
        switch (type) {
            case "CEDULA_DE_CIUDADANIA":
                return "C.C."
            case "CEDULA_DE_EXTRANJERIA":
                return "C.E."
            case "NUMERO_DE_IDENTIFICACION_PERSONAL":
                return "NUIP"
            case "TARJETA_DE_IDENTIDAD":
                return "T.I."
            case "PASAPORTE":
                return "Pasaporte"
        }
    }

    const onDocumentTypeChange = (value: string) => {
        console.log(value)
        if (value == 'NATURAL') {
            setNaturalHidden(true)
        } else {
            setNaturalHidden(false)
        }
    };

    return (
        <PageLayout>
            <Form
                {...formItemLayout}
                form={form}
                name="connect-owner"
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

            <Table dataSource={owners} rowKey="id">

                <Column title="Documento" dataIndex="id_type" key="id_type"
                    render={(_: any, record: DataRow) => (
                        <Space size="middle">
                            {DocumentType(record.id_type)}
                        </Space>
                    )} />
                <Column title="ID" dataIndex="id" key="id" />
                <Column title="Nombres" dataIndex="names" key="names" />
                <Column title="Apellidos" dataIndex="lastnames" key="lastnames" />
                <Column title="Direccion" dataIndex="address" key="address" />
                <Column title="Tel." dataIndex="phone" key="phone" />
                <Column title="E-Mail" dataIndex="email" key="email" />
                <Column title="Persona..." dataIndex="person_type" key="person_type" />
                <Column title="NIT" dataIndex="NIT" key="NIT" />
                <Column title="Razon Social" dataIndex="business_name" key="business_name" />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataRow) => (
                        <Space size="middle">
                            <Button htmlType="button" onClick={() => { disconnectOwner(record.id) }}>Desconectar</Button>
                            <Link href={`/owner/${record.id}/edit`}>Editar</Link>
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

export default Propietarios;