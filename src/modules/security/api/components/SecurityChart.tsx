import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { SecurityResponse } from '../../../../interfaces/security';

export type SecurityChartProps = {
    security: SecurityResponse;
    isUpdating: boolean;
}

export default function SecurityChart({ security, isUpdating }: SecurityChartProps) {
    const Stock = dynamic(() => import('@ant-design/plots').then(({ Stock }) => Stock), {
        ssr: false,
        loading: () => <div>Loading...</div>,
    });

    const slider = security.prices.length > 180 ? {
        formatter: (val: any) => dayjs(val).format('YYYY-MM-DD')
    } : undefined;

    return (
        <Stock style={{ height: "50vh" }}
            data={security.prices}
            loading={isUpdating}
            padding="auto"
            xField="date"
            yField={['open', 'close', 'high', 'low']}
            meta={{
                open: {
                    alias: 'Open',
                    formatter: value => value.toFixed(2)
                },
                close: {
                    alias: 'Close',
                    formatter: value => value.toFixed(2)
                },
                high: {
                    alias: 'High',
                    formatter: value => value.toFixed(2)
                },
                low: {
                    alias: 'Low',
                    formatter: value => value.toFixed(2)
                }
            }}
            slider={slider}
            yAxis={{
                label: {
                    formatter: (v) => Number(v).toFixed(2)
                }
            }}
            tooltip={{
                crosshairs: {
                    text: (type, defaultContent) => {
                        let content;
                        if (type === 'y') content = defaultContent.toFixed(2);
                        else content = dayjs(defaultContent).format('YYYY-MM-DD');

                        return {
                            content,
                            style: {
                                fill: '#dfdfdf',
                            },
                        }
                    }
                }
            }}
            fallingFill='#ef5350'
            risingFill='#26a69a'
        />
    )
}
