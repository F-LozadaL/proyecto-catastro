import { Button, Divider, Form, Input, Select } from "antd";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { prisma } from "../../../lib/prisma";

const { Option } = Select;

interface Owner {
    owner: {
        id: number,
        id_type: string,
        names: string,
        lastnames: string,
        address: string,
        phone: string,
        person_type: string,
        NIT: number | undefined,
        business_name: number | undefined,
        email: string
    }
}

interface FormData {

    id: number,
    id_type: string,
    names: string,
    lastnames: string,
    address: string,
    phone: string,
    person_type: string,
    NIT: number | undefined,
    business_name: number | undefined,
    email: string

}


const Editar: NextPage<Owner> = (own) => {

    const router = useRouter();
    const { id } = router.query
    const owner = own.owner
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const [form] = Form.useForm();


    async function updateOwner(data: FormData) {

        try {
            await fetch(`http://localhost:3000/api/o/${id}`, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            })
        } catch (error) {

        }

    }


    const onFinish = async (data: FormData) => {

        if (data.person_type == 'NATURAL') {
            data.NIT = undefined
            data.business_name = undefined
        }
        data.id = Number(data.id)

        try {
            updateOwner(data)
            refreshData()
        } catch (error) {
            console.log(error)
        }
    };

    const onReset = () => {
        form.resetFields();
    };
    // ANT DESIGN STUFF
    type LayoutType = Parameters<typeof Form>[0]['layout'];
    const [forma] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

    const [naturalFlag, setNaturalFlag] = useState<boolean>(
        owner.person_type == 'NATURAL'
    );

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

    // ANT DESIGN STUFF -END
    const onDocumentTypeChange = (value: string) => {
        console.log(value)
        if (value == 'NATURAL') {
            setNaturalFlag(true)
        } else {
            setNaturalFlag(false)
        }
    };
    return (

        <PageLayout>
            <Form
                {...formItemLayout}
                form={form}
                name="edit-owner"
                onFinish={onFinish}
                initialValues={{
                    id_type: owner.id_type,
                    id: owner.id,
                    names: owner.names,
                    lastnames: owner.lastnames,
                    address: owner.address,
                    phone: owner.phone,
                    NIT: owner.NIT,
                    business_name: owner.business_name,
                    person_type: owner.person_type,
                    email: owner.email
                }}>
                <Form.Item label='Tipo de Documento' name='id_type' rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="CEDULA_DE_CIUDADANIA">C.C.</Option>
                        <Option value="CEDULA_DE_EXTRANJERIA">C.E</Option>
                        <Option value="NUMERO_DE_IDENTIFICACION_PERSONAL">NUIP</Option>
                        <Option value="TARJETA_DE_IDENTIDAD">T.I.</Option>
                        <Option value="PASAPORTE">Pasaporte</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Numero de Documento' name='id' rules={[{ required: true }]} >
                    <Input />
                </Form.Item>
                <Form.Item label='Nombres' name='names' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='Apellidos' name='lastnames' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='Direccion' name='address' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='Numero Telefonico' name='phone' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='Tipo de Persona' name='person_type' rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        onChange={onDocumentTypeChange}
                        allowClear
                    >
                        <Option value="NATURAL">NATURAL</Option>
                        <Option value="JURIDICA">JURIDICA</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='NIT' name='NIT' hidden={naturalFlag} >
                    <Input />
                </Form.Item>
                <Form.Item label='Razon Social' hidden={naturalFlag} name='business_name'>
                    <Input />
                </Form.Item>
                <Form.Item label='E-Mail' name='email' rules={[{ required: true }]}>
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

        </PageLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    let ownerId;

    if (ctx.params != undefined) {
        ownerId = Number(ctx.params.id)
    } else {
        ownerId = 0;
    }
    const owner = await prisma.propietario.findUnique({
        where: {
            id: ownerId
        }
    })

    return {
        props: {
            owner
        }
    }
}


export default Editar;

