import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Row, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { SecurityResponse } from "../../interfaces/security";
import DashboardLayout from "../../layout/dashboard";
import { nameof } from "../../lib/utils";

const columns: ColumnsType<SecurityResponse> = [
  {
    title: "Ticker",
    align: "center",
    dataIndex: nameof<SecurityResponse>("ticker"),
    width: 150,
    sorter: (a, b) => a.ticker.localeCompare(b.ticker),
  },
  {
    title: "Name",
    dataIndex: nameof<SecurityResponse>("name"),
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Latest",
    align: "right",
    width: 200,
    dataIndex: nameof<SecurityResponse>("lastPrice"),
    sorter: (a, b) => a.lastPrice && b.lastPrice ? a.lastPrice - b.lastPrice : 0,
  },
  {
    title: "Δ %",
    align: "right",
    width: 200,
    dataIndex: nameof<SecurityResponse>("dailyChangePercentage"),
    sorter: (a, b) => a.dailyChangePercentage && b.dailyChangePercentage ? a.dailyChangePercentage - b.dailyChangePercentage : 0,
    render: value => <Typography.Text type={value > 0 ? "success" : "danger"}>{(value * 100)?.toFixed(2)}</Typography.Text>
  },
  {
    title: "Δ amount",
    align: "right",
    width: 200,
    dataIndex: nameof<SecurityResponse>("dailyChange"),
    sorter: (a, b) => a.dailyChange && b.dailyChange ? a.dailyChange - b.dailyChange : 0,
    render: value => <Typography.Text type={value > 0 ? "success" : "danger"}>{value}</Typography.Text>
  },
  {
    title: "Updated",
    width: 200,
    dataIndex: nameof<SecurityResponse>("updatedAt"),
    render: value => dayjs(value).format('MMM D, YYYY')
  },
  {
    title: "Action",
    key: "actions",
    align: "center",
    width: 100,
    render: () => <div>actions</div>
  }
]

export default function SecurityPage() {
  const [securities, setSecurities] = useState<SecurityResponse[] | undefined>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>();

  useEffect(() => {
    async function getSecurities() {
      const res = await fetch('/api/security');

      if (!res.ok) setShowError(true);

      const json = await res.json();
      setSecurities(json);
      setLoading(false);
    }
    getSecurities();
  }, []);

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          {showError && <Alert showIcon type="error" message="Error retreiving securities, please try again later" />}
          <Card title="Securities" extra={<Button icon={<PlusOutlined />} onClick={() => router.push('/security/add')} >Add</Button>}>
            <Table dataSource={securities} columns={columns} rowKey={nameof<SecurityResponse>("ticker")} pagination={false} loading={loading} />
          </Card>
        </Col>
      </Row >
    </>
  )
}

SecurityPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
