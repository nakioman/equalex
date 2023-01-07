import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import EqualexTable from '../../../common/components/EqualexTable';
import { MoneyTransactionResponse } from '../../../interfaces/account';
import DashboardLayout from '../../../layout/dashboard';
import { nameof } from '../../../lib/utils';
import { getMoneyTransactions } from '../../../modules/account/api/getMoneyTransactions';
import MoneyTransactionColumns from '../../../modules/account/components/MoneyTransactionColumns';

type MoneyTransactionPageProps = InferGetStaticPropsType<typeof getServerSideProps>;

export default function MoneyTransactionPage({ transactions }: MoneyTransactionPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const columns = MoneyTransactionColumns(() => {
        setLoading(true);
        router.replace('/account/transaction');
        if (router.isReady) setLoading(false);
    });

    return (
        <EqualexTable
            addLink="/account/transaction/add"
            title="Money transactions"
            columns={columns}
            dataSource={transactions}
            rowKey={nameof<MoneyTransactionResponse>('id')}
            loading={loading}
        />
    );
}

MoneyTransactionPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout title='Money transactions'>{page}</DashboardLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const token = await getToken(ctx);
    const userId = token?.sub as string;
    const transactions = token ? await getMoneyTransactions(userId) : [];
    return {
        props: {
            transactions,
        },
    };
};