import React from 'react';
import { Button, Icon } from 'antd';

export const ExpandButton: React.FC = props => (
  <Button
    type='primary'
    style={{
      position: 'absolute',
      bottom: 15,
      right: 20
    }}
    className='box-shadow'
    {...props}
  >
    <Icon type='arrows-alt' />
  </Button>
);
