import React from 'react';

export const Card: React.FC<{ bordered?: boolean; [index: string]: any }> = ({
  children,
  bordered,
  ...props
}) => (
  <div
    className={`card border-radius-5 ${
      bordered ? 'bordered block-card' : 'box-shadow-light'
    }`}
    {...props}
  >
    {children}
  </div>
);
