import { DatePicker, message, Typography } from 'antd';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

const { Title } = Typography;

const Antd = () => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const handleChange = (value: Dayjs | null) => {
    message.info(
      `Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`
    );
    setDate(value);
  };
  return (
    <div style={{ width: 400, margin: '100px auto', background: 'white' }}>
      <DatePicker onChange={handleChange} />
      <div style={{ marginTop: 16 }}>
        <Title level={3}>
          Selected Date: {date ? date.format('YYYY-MM-DD') : 'None'}
        </Title>
      </div>
    </div>
  );
};

export default Antd;
