import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select } from 'antd';
import dayjs from 'dayjs';
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { MoneyTransactionRequest } from '../../../interfaces/account';
import DashboardLayout from '../../../layout/dashboard';
import { getAccounts } from '../../../modules/account/api/getAccounts';

type AddMoneyPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function AddMoneyPage({ accounts }: AddMoneyPageProps) {
    const [transactionForm] = Form.useForm<MoneyTransactionRequest>();
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const { accountId } = router.query;

    const onFinish = async (values: MoneyTransactionRequest) => {
        setIsSaving(true);

        const res = await fetch('/api/account/transaction', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (res.ok) router.push('/account/transaction');
        else messageApi.error({ type: 'error', content: 'Error adding transaction, please try again', duration: 5 });

        setIsSaving(false);
    };

    return (
        <>
            {contextHolder}
            <Card title="New transaction">
                <Form
                    name="transaction-add"
                    layout="horizontal"
                    form={transactionForm}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{ createdAt: dayjs(), accountId }}
                >
                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Please input an amount for the transaction' }]}
                    >
                        <InputNumber autoFocus formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                        label="Date (YYYY-MM-DD)"
                        name="createdAt"
                        rules={[{ required: true, message: 'Please input date for the transaction' }]}
                    >
                        <DatePicker format={["MMM D, YYYY", "YYYY-MM-DD"]} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item name="accountId" label="Acocunt type" rules={[{ required: true, message: 'Please choose an account' }]}>
                        <Select>
                            {accounts.map(account => <Select.Option key={account.id} value={account.id}>{account.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" htmlType="submit" disabled={isSaving} loading={isSaving}>
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}

AddMoneyPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout title='Add money'>{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const token = await getToken(ctx);
    const userId = token?.sub as string;
    const accounts = token ? await getAccounts(userId) : [];

    return {
        props: {
            accounts,
        },
    };
};