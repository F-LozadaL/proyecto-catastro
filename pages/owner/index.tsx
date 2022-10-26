
import { Button, Divider, Form, Input, Select } from "antd";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";
import { prisma } from "../../lib/prisma";

const { Option } = Select;

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

interface Owners {
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
        email: string
    }[]
}



const Owner: NextPage<Owners> = ({ owners }) => {

    const router = useRouter();
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }

    async function createPropietario(data: FormData) {
        try {
            await fetch('http://localhost:3000/api/o/createPropietario', {
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


    // ANT DESIGN STUFF
    type LayoutType = Parameters<typeof Form>[0]['layout'];
    const [forma] = Form.useForm();
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

        if (data.person_type == 'NATURAL') {
            data.NIT = undefined
            data.business_name = undefined
        }
        data.id = Number(data.id)

        try {
            forma.resetFields();
            createPropietario(data)
            // refreshData()
        } catch (error) {
            console.log(error)
        }
    };
    const onReset = () => {
        forma.resetFields();
    };

    // ANT DESIGN STUFF -END
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
                form={forma}
                name="create-predio"
                onFinish={onFinish}
                initialValues={{
                    id: 123,
                    id_type: "CEDULA_DE_CIUDADANIA",
                    names: "francisco",
                    lastnames: "lozada",
                    address: "cra 55 4d#3",
                    phone: "333 333 3333",
                    person_type: "NATURAL",
                    NIT: "e123",
                    business_name: "emperesita SA",
                    email: "emperesitaSA@gmail.com"
                }}
            >

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
                <Form.Item label='NIT' name='NIT' hidden={naturalHidden} >
                    <Input />
                </Form.Item>
                <Form.Item label='Razon Social' hidden={naturalHidden} name='business_name'>
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

    const owners = await prisma.propietario.findMany({
        where: {
            id: predioId
        }
    })

    return {
        props: {
            owners
        }
    }
}
export default Owner;


