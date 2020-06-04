import React from 'react';
import { Table } from 'antd';
const { Column } = Table;

const data = [
  {
    key: '1',
    hash: '0x4808A49bFB7527C142eb2C5b5718CeF432223ae7'
  },
  {
    key: '2',
    hash: '0x4808A49bFB7527C142eb2C5b5718CeF432223ae7'
  },
  {
    key: '3',
    hash: '0x4808A49bFB7527C142eb2C5b5718CeF432223ae7'
  },
  {
    key: '4',
    hash: '0x4808A49bFB7527C142eb2C5b5718CeF432223ae7'
  },
  {
    key: '5',
    hash: '0x4808A49bFB7527C142eb2C5b5718CeF432223ae7'
  },
  {
    key: '6',
    hash: '0x4808A49bFB7527C142eb2C5b5718CeF432223ae7'
  }
];

export const BlockTable: React.FC = () => (
  <Table
    showHeader={false}
    pagination={false}
    dataSource={data}
    style={{
      width: '100%',
      height: '100%'
    }}
  >
    <Column title='Block No.' dataIndex='key' key='key' />
    <Column
      title='Block Hash'
      dataIndex='hash'
      
      render={text => (
        <div
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 300,
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <a href='#'>{text}</a>
        </div>
      )}
      key='hash'
    />
  </Table>
);
