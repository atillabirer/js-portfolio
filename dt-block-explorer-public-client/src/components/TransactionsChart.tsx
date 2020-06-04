import React, { useState, useEffect } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import { Row, Col, Typography } from 'antd';
import { instance as axios } from '../lib/axios';
import { PriceCard } from '../components';

import './TransactionsChart.less';
import { useWindowSize } from '../lib';

const TransactionsChart: React.FC = () => {
  const [tps, setTps] = useState(0);
  const  { width }  = useWindowSize();

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data }: { data: {tps: number} } = await axios.get('/api/tps');
      
      setTps(data.tps);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Row
      style={{
        backgroundColor: "var(--lighter-purple)",
        maxWidth: 1200,
        display: "flex",
        flexDirection: width && width < 768 ? "column" : "row",
        width:"100%",
        margin: width && width > 768 ? '35px auto' : ''
      }}
      gutter={16}
    >
    <Col
        sm={24}
        md={18}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
          <div className="TransactionsChart">
        <Typography.Title level={3} className="TransactionsChart__Title">
          Transactions per second
        </Typography.Title>
          <ReactSpeedometer 
            needleColor="#ffffff"
            endColor="#491ead"
            startColor="#8e69e4"
            minValue={0}
            value={tps} 
            maxValue={11000}
            fluidWidth
            textColor="#ffffff"
            customSegmentLabels={[
              {
                text: '1000',
                color: '#ffffff',
              },
              {
                text: '2500',
                color: '#ffffff',
              },
              {
                text: '5000',
                color: '#ffffff',
              },
              {
                text: '7500',
                color: '#ffffff',
              },
              {
                text: '10000',
                color: '#ffffff',
              }
            ]}
            />
        </div>
      </Col>
      <Col
        sm={24}
        md={6}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flexGrow: 1
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            flexGrow: 1,
            borderRadius: 5,
            backgroundColor: "transparent",

            width: "100%",
            boxShadow: "box-shadow: 2px 2px 9px 1px rgba(18, 23, 29, 0.2)",
            flexDirection: "column"
          }}
        >
          <PriceCard
            formatted={true}
            up={true}
            name={"Transactions per second"}
            value={`${tps}`}
            style={{ marginTop: 10, height: 60 }}
          ></PriceCard>
        </div>
      </Col>

    </Row>
  );
};

export default TransactionsChart;
