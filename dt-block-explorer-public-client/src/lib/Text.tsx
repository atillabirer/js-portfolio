import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const BlockText: React.FC<{
  title: string;
  type?: 'STRONG' | 'REGULAR';
  color?: 'normal' | 'inverted';
}> = ({ title, children, type = 'REGULAR', color }) => {
  const outerStyles =
    type === 'REGULAR'
      ? {}
      : {
          margin: '5px 0'
        };
  const valueStyles =
    type === 'REGULAR'
      ? {}
      : {
          fontSize: 18
        };
  return (
    <div style={{ ...outerStyles, display: 'flex', overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' }}>
      <span
        style={
          type === 'REGULAR'
            ? {
                fontSize: 16,
                fontWeight: 'inherit',
                marginRight: 5
              }
            : {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#222',
                marginRight: 5
              }
        }
      >
        <Text style={color == 'inverted' ? { color: '#ddd' } : undefined}>
          {title}:
        </Text>
      </span>
      <span style={{ ...valueStyles }}>
        <Text style={color == 'inverted' ? { color: '#fff' } : undefined}>
          {children}
        </Text>
      </span>
    </div>
  );
};

export const BlockDetails: React.FC<{
  transactions: number;
  time: String;
  color?: 'inverted' | 'primary';
}> = ({ time, transactions, color = 'primary' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start'
      }}
    >
      <span style={{ marginRight: '2em' }}>
        <Text
          style={color == 'inverted' ? { color: '#bbb' } : undefined}
          type='secondary'
        >
          {transactions} Transactions
        </Text>
      </span>
      <span>
        <Text
          style={color == 'inverted' ? { color: '#bbb' } : undefined}
          type='secondary'
        >
          {time}
        </Text>
      </span>
    </div>
  );
};
