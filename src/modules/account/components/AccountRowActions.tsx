import { DeleteOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

export default function AccountRowActions() {
  const deleteAccount = () => {};
  return (
    <>
      <Space>
        <Button title="Delete account" onClick={deleteAccount}>
          <DeleteOutlined />
        </Button>
      </Space>
    </>
  );
}
