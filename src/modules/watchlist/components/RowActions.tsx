import { DeleteOutlined, ExclamationCircleFilled, SyncOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { useState } from 'react';
import { WatchlistResponse } from '../../../interfaces/watchlist';

export type RowActionsProps = {
  watchlist: WatchlistResponse;
  refresh: () => void;
};

export default function RowActions({ watchlist, refresh }: RowActionsProps) {
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();
  const [updating, setUpdating] = useState<boolean>();

  const deleteSecurity = () => {
    confirm({
      title: 'Delete security',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure to delete this security?',
      async onOk() {
        const res = await fetch(`/api/watchlist/${watchlist.id}`, { method: 'DELETE' });
        if (res.ok) {
          refresh();
        } else messageApi.error('Error deleting security, please try again', 5);
      },
    });
  };

  const updateSecurity = async () => {
    setUpdating(true);
    const res = await fetch(`/api/worker/security?ticker=${watchlist.ticker}`, {
      method: 'PUT',
    });

    if (!res.ok) {
      messageApi.error(`Error updating security ${watchlist.name}, please try again`, 5);
    } else {
      refresh();
    }
    setUpdating(false);
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button title="Update security" onClick={updateSecurity} disabled={updating}>
          <SyncOutlined spin={updating} />
        </Button>
        <Button title="Delete security" onClick={deleteSecurity}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
}
