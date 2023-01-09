import { DeleteOutlined, ExclamationCircleFilled, FormOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SecurityTransactionResponse } from '../../../interfaces/security';

export type RowActionsProps = {
  transaction: SecurityTransactionResponse;
  refresh: () => void;
};

export default function RowActions({ transaction, refresh }: RowActionsProps) {
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState<boolean>();

  const deleteTransaction = () => {
    confirm({
      title: 'Delete Transaction',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure to delete this transaction?',
      async onOk() {
        const res = await fetch(`/api/security/transaction/${transaction.id}`, { method: 'DELETE' });
        if (res.ok) {
          refresh();
        } else messageApi.error('Error deleting transaction, please try again', 5);
      },
    });
  };

  const refreshSecurity = async () => {
    setIsRefreshing(true);
    const res = await fetch(`/api/worker/security?ticker=${transaction.ticker}`, {
      method: 'PUT',
    });

    if (!res.ok) {
      messageApi.error(`Error updating security ${transaction.securityName}, please try again`, 5);
    } else {
      refresh();
    }
    setIsRefreshing(false);
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button size="small" title="Refresh security" onClick={refreshSecurity} disabled={isRefreshing}>
          <SyncOutlined spin={isRefreshing} />
        </Button>
        <Button
          size="small"
          title="Update transaction"
          onClick={() => router.push(`/security/transaction/${transaction.id}`)}
        >
          <FormOutlined />
        </Button>
        <Button size="small" title="Delete transaction" onClick={deleteTransaction}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
}
