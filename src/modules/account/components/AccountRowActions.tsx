import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { useRouter } from 'next/dist/client/router';
import { FaMoneyBill } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { AccountResponse } from '../../../interfaces/account';

export type AccountRowActionsProps = {
  account: AccountResponse;
  refresh: () => void;
};

export default function AccountRowActions({ account, refresh }: AccountRowActionsProps) {
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const deleteAccount = () => {
    confirm({
      title: 'Delete account',
      icon: <ExclamationCircleFilled />,
      content: "Are you sure to delete this account and ALL it's transactions?",
      async onOk() {
        const res = await fetch(`/api/account/${account.id}`, { method: 'DELETE' });
        if (res.ok) {
          refresh();
        } else messageApi.error('Error deleting account, please try again', 5);
      },
    });
  };
  return (
    <>
      {contextHolder}
      <Space>
        <Button title="Transactions" onClick={() => router.push(`/account/transaction?accountId=${account.id}`)}>
          <FaMoneyBill />
        </Button>
        <Button title="Add transaction" onClick={() => router.push(`/account/transaction/add?accountId=${account.id}`)}>
          <GiPayMoney />
        </Button>
        <Button title="Delete account" onClick={deleteAccount}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
}
