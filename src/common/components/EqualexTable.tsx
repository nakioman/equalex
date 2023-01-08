import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Table } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ColumnsType } from 'antd/es/table';
import { ExpandableConfig } from 'antd/es/table/interface';
import { useRouter } from 'next/router';

export type EqualexTableComponentProps = {
  addLink: string;
  dataSource: object[];
  columns: ColumnsType<any>;
  rowKey: string;
  loading?: boolean;
  title: string;
  size?: SizeType;
  expandable?: ExpandableConfig<any>;
};

export default function EqualexTableComponent({
  addLink,
  dataSource,
  columns,
  rowKey,
  loading,
  title,
  size,
  expandable,
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
      <Table
        size={size ?? 'middle'}
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        pagination={false}
        expandable={expandable}
        loading={loading}
      />
    </Card>
  );
}
