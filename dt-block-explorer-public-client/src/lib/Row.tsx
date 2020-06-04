import React from 'react';
import { Row as AntRow } from 'antd';

type FlexJustify =
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'flex-start'
  | 'flex-end';

type RowProps = {
  width?: number | string;
  margin?: {
    bottom?: number | string;
    top?: number | string;
    right?: number | string;
    left?: number | string;
  };
  marginAll?: string | number;
  display?: 'flex' | 'block' | 'inline-block';
  flexDirection?: 'row' | 'column';
  justifyContent?: FlexJustify;
  alignItems?: FlexJustify;
  gutter?: number;
  padding?: number | string;
  style?: any
};

export const Row: React.FC<RowProps> = ({
  marginAll,
  width = '100%',
  margin,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  gutter,
  children,
  padding,
  style
}) => (
  <AntRow
    style={{
      margin: marginAll,
      marginTop: margin && margin.top,
      marginBottom: margin && margin.bottom,
      marginLeft: margin && margin.left,
      marginRight: margin && margin.right,
      width,
      display,
      flexDirection,
      justifyContent,
      alignItems,
      padding,
      ...style
    }}
    gutter={gutter}
  >
    {children}
  </AntRow>
);
