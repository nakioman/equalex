import { Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import { SecurityResponse } from "../../../../interfaces/security";

export type SecurityPricesProps = {
    security: SecurityResponse;
}

export default function SecurityPrices({ security }: SecurityPricesProps) {
    const { Title, Text } = Typography;
    const currentPriceData = security.prices[security.prices.length - 1];

    return (
        <Row style={{ marginBottom: '1.5em' }}>
            <Col span={2}>
                <Title style={{ margin: 0 }}>{security.lastPrice?.toFixed(2)}</Title>
                {security.dailyChange && <Title style={{ margin: 0 }} level={3} type={security.dailyChange > 0 ? 'success' : 'danger'}>{security.dailyChange > 0 ? '+' : ''}{security.dailyChange.toFixed(2)}</Title>}
                <Text>{dayjs(security.lastPriceUpdatedAt).format('MMM D, YYYY')}</Text>
            </Col>
            <Col span={3}>
                <Row gutter={[0, 0]}>
                    <Col span={10} style={{ justifyContent: 'end', display: 'flex' }}><Text>Open:</Text></Col>
                    <Col span={14} style={{ justifyContent: 'end', display: 'flex' }}><Text strong>{currentPriceData.open.toFixed(2)}</Text></Col>
                </Row>
                <Row gutter={[0, 0]}>
                    <Col span={10} style={{ justifyContent: 'end', display: 'flex' }}><Text>High:</Text></Col>
                    <Col span={14} style={{ justifyContent: 'end', display: 'flex' }}><Text strong>{currentPriceData.high.toFixed(2)}</Text></Col>
                </Row>
                <Row gutter={[0, 0]}>
                    <Col span={10} style={{ justifyContent: 'end', display: 'flex' }}><Text>Low:</Text></Col>
                    <Col span={14} style={{ justifyContent: 'end', display: 'flex' }}><Text strong>{currentPriceData.low.toFixed(2)}</Text></Col>
                </Row>
                <Row gutter={[0, 0]}>
                    <Col span={10} style={{ justifyContent: 'end', display: 'flex' }}><Text>Volume:</Text></Col>
                    <Col span={14} style={{ justifyContent: 'end', display: 'flex' }}><Text strong>{currentPriceData.volume}</Text></Col>
                </Row>
            </Col>
        </Row>
    )
}