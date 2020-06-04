import React from 'react';
import { Col, Row } from 'antd';
import { Card } from '../lib';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { useWindowSize } from '../lib';

export const BlockCard: React.FC<{
  type?: 'Success' | 'Pending' | 'Failed';
  data?: any
}> = ({data}) => {
  const { width } = useWindowSize();
  const history = useHistory();
  return (
    <Row
      style={{ width: '100%', display: 'flex', margin: '16px 0' }}
      onClick={e => history.push(`/block/${data.number}`)}
      className='block-card'
    >
      <Col
        span={24}
        style={{
          minHeight: 60
        }}
        className='column'
      >
        <Card
          bordered
          style={{
            display: 'flex',
            flexDirection: width && width > 768 ? 'row' : 'column'
          }}
        >
          <Col
            md={4}
            sm={24}
            style={{ padding: 20, alignItems: 'center', display: 'flex' }}
          >
            <Link to={`/block/${data.number}`} style={{ fontWeight: 600 }}>
            {data.number}
            </Link>
          </Col>
          <Col
            md={4}
            sm={24}
            style={{ padding: 20, alignItems: 'center', display: 'flex' }}
          >
            {moment(new Date(data.timestamp * 1000)).fromNow()}
          </Col>
          <Col
            md={4}
            sm={24}
            style={{ padding: 20, alignItems: 'center', display: 'flex' }}
          >
            {data.transactions} Transactions
          </Col>
          <Col
            style={{
              alignItems: 'center',
              display: 'flex',
              padding: width && width < 768 ? 20 : 0
            }}
            md={12}
            sm={24}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {data.hash}
            </span>
          </Col>
        </Card>
      </Col>
    </Row>
  );
};
