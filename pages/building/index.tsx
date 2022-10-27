import { Button, Divider, Form, Input, Select } from "antd";
import Item from "antd/lib/list/Item";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import PageLayout from "../../components/PageLayout";

import { prisma } from "../../lib/prisma";

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


// ANT DESIGN STUFF -END

const Building: NextPage<Building> = ({ buildings }) => {

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



    async function addConstruccion(data: FormData) {
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



    const onFinish = async (data: FormData) => {


        data.area_m2 = Number(data.area_m2)
        data.floors = Number(data.floors)

        try {
            form.resetFields();
            addConstruccion(data)
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


export default Building;



