import React, { useState } from 'react';
import { DatePicker, message, Typography } from 'antd';

const Antd = () => {
  const [date, setDate] = useState(null);
  const handleChange = (value) => {
    message.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    setDate(value);
  };
  return (
    <div style={{ width: 400, margin: '100px auto', background: 'white' }}>
      <DatePicker onChange={handleChange} />
      <div style={{ marginTop: 16 }}>
        <Typography.Title level={3}>Selected Date: {date ? date.format('YYYY-MM-DD') : 'None'}</Typography.Title>
      </div>
    </div>
  );
};

export default Antd;
