import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, message, Modal, Space } from "antd";
import { SecurityResponse } from "../../../interfaces/security";

export type RowActionsProps = {
  security: SecurityResponse,
  refresh: () => void
}

export default function RowActions({ security, refresh }: RowActionsProps) {
  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();

  const deleteSecurity = () => {
    confirm({
      title: 'Delete security',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure to delete this security?',
      async onOk() {
        const res = await fetch(`/api/watchlist/${security.id}`, { method: 'DELETE' });
        if (res.ok) {
          refresh();
        }
        else messageApi.error('Error deleting security, please try again', 5);
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button title="Delete security" onClick={deleteSecurity}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  )
}
