import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Table } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ColumnsType } from 'antd/es/table';
import { ExpandableConfig } from 'antd/es/table/interface';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

export type EqualexTableComponentProps = {
  addLink: string;
  dataSource: object[];
  columns: ColumnsType<any>;
  rowKey: string;
  loading?: boolean;
  title: string;
  size?: SizeType;
  expandable?: ExpandableConfig<any>;
  children?: ReactNode;
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
  children,
}: EqualexTableComponentProps) {
  const windowSize = useWindowSize();
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
      {children}
      <Table
        size={size ?? 'middle'}
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        pagination={false}
        expandable={expandable}
        loading={loading}
        scroll={{ y: windowSize.height ? windowSize.height * 0.75 : undefined, x: undefined }}
        sticky
      />
    </Card>
  );
}

type WindowSize = {
  height?: number;
  width?: number;
};

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      // Add event listener
      window.addEventListener('resize', handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
