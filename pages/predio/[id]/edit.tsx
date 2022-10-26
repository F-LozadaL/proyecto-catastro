import { Button, Divider, Form, Input } from "antd";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Router, { useRouter } from "next/router";
import PageLayout from "../../../components/PageLayout";
import { prisma } from "../../../lib/prisma";

interface FormData {
    appraise: number,
    department: string,
    city: string
}

interface Predio {
    predio: {
        id: number,
        department: string,
        city: string,
        appraise: number
        _count: PrediosCount,
        lands: boolean
    }
}
interface PrediosCount {
    owner: number,
    buildings: number
}
const Editar: NextPage<Predio> = ({ predio }) => {

    const router = useRouter();
    const { id } = router.query
    // Call this function whenever you want to
    // refresh props!
    const refreshData = () => {
        router.replace(router.asPath);
    }
    // console.log(predio)
    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    }

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    async function updatePredio(data: FormData) {
        try {
            console.log(id)
            await fetch(`http://localhost:3000/api/p/${id}`, {
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

        data.appraise = Number(data.appraise)
        try {
            form.resetFields();
            updatePredio(data)
        } catch (error) {
            console.log(error)
        }
    };

    const onReset = () => {
        form.resetFields();
    };
    console.log(predio.city)
    return (

        <PageLayout>
            <Form
                {...formItemLayout}
                form={form}
                name="edit-predio"
                onFinish={onFinish}>
                <Form.Item label='Departamento' name='department' rules={[{ required: true }]}>
                    <Input placeholder={predio.department} />
                </Form.Item>
                <Form.Item label='Ciudad' name='city' rules={[{ required: true }]}>
                    <Input placeholder={predio.city} />
                </Form.Item>
                <Form.Item label='Avaluo' name='appraise' rules={[{ required: true }]}>
                    <Input placeholder={String(predio.appraise)} />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Actualizar
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
    let predioId;
    if (ctx.params != undefined) {
        predioId = Number(ctx.params.id)
    } else {
        predioId = 0;
    }

    const predio = await prisma.predio.findFirst({
        where: {
            id: predioId
        },
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
            predio
        }
    }
}


export default Editar;