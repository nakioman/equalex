import { Card, Col, Divider, Form, Input, Row, Typography } from 'antd';
import { round } from 'lodash';
import { ReactElement, useState } from 'react';
import DashboardLayout from '../../layout/dashboard';

type RiskRewardForm = {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
};

type RiskRewardFormCalculations = {
  riskRewardRatio?: string;
  breakevenWinRate?: string;
  wyckoffStopLoss?: number;
};

export default function RiskRewardPage() {
  const [tickerForm] = Form.useForm<RiskRewardForm>();
  const [calculations, setCalculations] = useState<RiskRewardFormCalculations>();
  const { Text, Paragraph } = Typography;

  const onValuesChange = (changedValue: any, values: RiskRewardForm) => {
    if (isNaN(values.entryPrice) || isNaN(values.stopLoss) || isNaN(values.takeProfit)) return;

    const risk = Math.abs(values.entryPrice - values.stopLoss);
    const reward = Math.abs(values.takeProfit - values.entryPrice);
    const formattedRisk = round(risk / risk, 2);
    const formattedReward = round(reward / risk, 2);
    const riskRewardRatio = `${formattedRisk}:${formattedReward}`;
    const breakevenWinRate = `${round((formattedRisk / (formattedRisk + formattedReward)) * 100, 2)} %`;
    const wyckoffStopLoss = round(values.entryPrice * 0.92, 5);

    setCalculations({
      riskRewardRatio,
      breakevenWinRate,
      wyckoffStopLoss,
    });
  };

  return (
    <Card title="Calculate Risk/Reward">
      <Form name="risk-reward-form" layout="inline" form={tickerForm} onValuesChange={onValuesChange}>
        <Form.Item
          label="Entry Price"
          name="entryPrice"
          rules={[{ required: true, message: 'Please input an entry price' }]}
        >
          <Input type="number" autoFocus />
        </Form.Item>
        <Form.Item label="Stop Loss" name="stopLoss" rules={[{ required: true, message: 'Please input an stop loss' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Take Profit"
          name="takeProfit"
          rules={[{ required: true, message: 'Please input take profit' }]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
      <Divider />
      <Row>
        <Col span={3}>
          <Paragraph strong>Risk/Reward Ratio:</Paragraph>
        </Col>
        <Col span={20}>
          <Text>{calculations?.riskRewardRatio ?? '-'}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={3}>
          <Paragraph strong>Breakeven Win Rate (%):</Paragraph>
        </Col>
        <Col span={20}>
          <Text>{calculations?.breakevenWinRate ?? '-'}</Text>
        </Col>
      </Row>
      <Row>
        <Col span={3}>
          <Paragraph strong>Wyckoff Stop Loss:</Paragraph>
        </Col>
        <Col span={20}>
          <Text>{calculations?.wyckoffStopLoss ?? '-'}</Text>
        </Col>
      </Row>
    </Card>
  );
}

RiskRewardPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Risk/Reward">{page}</DashboardLayout>;
};
