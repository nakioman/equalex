import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { MoneyTransactionResponse } from '../../../interfaces/account';

export type MoneyTransactionRowActionsProps = {
  transaction: MoneyTransactionResponse;
  refresh: () => void;
};

export default function MoneyTransactionRowActions({ transaction, refresh }: MoneyTransactionRowActionsProps) {
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();

  const deleteMoney = () => {
    confirm({
      title: 'Delete money transaction',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure to delete this money transaction?',
      async onOk() {
        const res = await fetch(`/api/account/transaction/${transaction.id}`, { method: 'DELETE' });
        if (res.ok) {
          refresh();
        } else messageApi.error('Error deleting money transaction, please try again', 5);
      },
    });
  };
  return (
    <>
      {contextHolder}
      <Space>
        <Button size="small" title="Delete account" onClick={deleteMoney}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
}
