import { Button, Divider, Form, Input, Select } from "antd";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import build from "next/dist/build";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../../components/PageLayout";
import { prisma } from "../../../lib/prisma";

const { Option } = Select;

interface Building {
    building: {
        id: number,
        area_m2: number,
        type: string,
        floors: number,
        address: string
    }
}
interface FormData {

    id: number,
    area_m2: number,
    type: string,
    floors: number,
    address: string

}

const Editar: NextPage<Building> = (bui) => {

    const router = useRouter();
    const { id } = router.query
    const building = bui.building

    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }
    const [form] = Form.useForm();


    async function updateBuilding(data: FormData) {

        try {
            await fetch(`http://localhost:3000/api/b/${id}`, {
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
        data.floors = Number(data.floors)
        try {
            form.resetFields();
            updateBuilding(data)
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
    console.log(building)
    return (

        <PageLayout>
            <Form
                {...formItemLayout}
                form={form}
                name="create-predio"
                onFinish={onFinish}
                initialValues={{
                    area_m2: building.area_m2,
                    type: building.type,
                    floors: building.floors,
                    address: building.address
                }}
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
                        Actualizar Construccion
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
    let buildingId;
    if (ctx.params != undefined) {
        buildingId = Number(ctx.params.id)
    } else {
        buildingId = 0;
    }

    const building = await prisma.construccion.findUnique({
        where: {
            id: buildingId
        }
    })
    console.log("props", building)
    return {
        props: {
            building
        }
    }
}


export default Editar;

