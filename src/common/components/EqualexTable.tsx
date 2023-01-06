import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';

export type EqualexTableComponentProps = {
  addLink: string;
  dataSource: object[];
  columns: ColumnsType<any>;
  rowKey: string;
  loading?: boolean;
  title: string;
};

export default function EqualexTableComponent({
  addLink,
  dataSource,
  columns,
  rowKey,
  loading,
  title,
}: EqualexTableComponentProps) {
  const router = useRouter();
  return (
    <Card
      title={title}
      extra={
        <Button icon={<PlusOutlined />} onClick={() => router.push(addLink)}>
          Add
        </Button>
      }
    >
      <Table dataSource={dataSource} columns={columns} rowKey={rowKey} pagination={false} loading={loading} />
    </Card>
  );
}
