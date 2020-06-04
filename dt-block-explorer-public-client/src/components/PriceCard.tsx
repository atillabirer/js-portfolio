import React from 'react';
import { Col, Typography, Icon } from 'antd';
import { Card } from '../lib';

function numberWithCommas(x: number | string): string {
  let xString: string = x.toString();
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(xString)) xString = xString.replace(pattern, '$1,$2');
  return xString;
}

export const PriceCard: React.FC<{
  up: boolean;

  name: String;
  value: any;
  formatted?: boolean;
  style?: any;
}> = ({ up, name, value, formatted, style }) => (
  <Col span={24} className='column' style={style}>
    <Card
      style={{
        backgroundColor: 'var(--darker-purple)',
        boxShadow: 'none'
      }}
    >
      <div
        className='column-inner'
        style={{
          display: 'flex',
          flexDirection: 'column',
          color: '#bbb',
          height: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span>
            {' '}
            <Typography.Title
              level={3}
              style={{ marginBottom: 0, color: '#C6D0DB', fontSize: 20 }}
            >
              {formatted ? numberWithCommas(value) : value}
            </Typography.Title>
          </span>
        </div>
        {name}
      </div>
    </Card>
  </Col>
);
