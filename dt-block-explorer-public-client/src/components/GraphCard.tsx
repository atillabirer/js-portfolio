import React from 'react';
import { Col } from 'antd';
import { Card } from '../lib';

export const GraphCard = ({
  span,
  color,
  children,
  ...props
}: {
  span?: number;
  color?: string;
  [index: string]: any;
}) => (
  <Col span={span || undefined} className='column' {...props}>
    <Card style={{backgroundColor: color}}>
      <div className='graph-column-inner'>{children}</div>
    </Card>
  </Col>
);
