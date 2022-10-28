import { Button, Divider, Form, Input, Select } from "antd";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import build from "next/dist/build";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { prisma } from "../../../lib/prisma";

const { Option } = Select;

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
interface FormData {

    id: number,
    area_m2: number,
    value: number,
    water: boolean,
    territory_type: string

}

const Editar: NextPage<Land> = (bui) => {

    const router = useRouter();
    const { id } = router.query
    const land = bui.land
    console.log(land)
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const [form] = Form.useForm();


    async function updateLand(data: FormData) {

        try {
            await fetch(`http://localhost:3000/api/l/${id}`, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            })
        } catch (error) {
            console.log(error)
        }
    }


    const onFinish = async (data: FormData) => {
        data.id = Number(id)
        data.area_m2 = Number(data.area_m2)
        try {
            updateLand(data)
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
    // console.log(building)
    return (

        <PageLayout>
            <Form
                {...formItemLayout}
                form={form}
                name="create-predio"
                onFinish={onFinish}

                initialValues={{
                    area_m2: land.area_m2,
                    value: land.value,
                    water: land.water,
                    territory_type: land.territory_type,
                    Buildings: land.Buildings
                }}
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
                        Actualizar Terreno
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
    let landId;
    if (ctx.params != undefined) {
        landId = Number(ctx.params.id)
    } else {
        landId = 0;
    }

    const land = await prisma.terreno.findUnique({
        where: {
            id: landId
        }
    })

    return {
        props: {
            land
        }
    }
}


export default Editar;

