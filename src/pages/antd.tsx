import DatePicker from 'antd/lib/date-picker';
import message from 'antd/lib/message';
import Typography from 'antd/lib/typography';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

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
        <Typography.Title level={3}>
          Selected Date: {date ? date.format('YYYY-MM-DD') : 'None'}
        </Typography.Title>
      </div>
    </div>
  );
};

export default Antd;
