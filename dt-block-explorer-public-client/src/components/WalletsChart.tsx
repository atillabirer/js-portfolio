import React, { useState, useEffect } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Row, Col } from "antd";
import { ClimbingBoxLoader } from "react-spinners";
import moment from "moment";
import { instance as axios, useWindowSize } from "../lib";

import { PriceCard } from '../components';

const WalletsChart: React.FC<{ totalTxns: number }> = ({ totalTxns }) => {
  const valueKey = 'Wallet Signups';

  const [loading, setLoading] = useState(false);
  const [totalSignUps, setTotalSignUps] = useState(0);
  const {width} = useWindowSize();
  const [data, setData] = useState<{ time: string, value: number }[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, status } = await axios.get('/api/wallet_stats');

      if (status === 200) {
        setData(data.rows.map((row: [string, string]) => ({ time: moment(row[0], 'YYYYMMDD').format("DD/MM"), [valueKey]: Number(row[1]) })));
        setTotalSignUps(Number(data.totalsForAllResults["ga:goal1Completions"]));
        setLoading(false);
      }
    })();
  }, [])


  if (loading) {
    return (
      <div style={{height: 400}}>
        <ClimbingBoxLoader color="#fff" />
      </div>
    )
  }

  return (
    
    <Row
    style={{
      backgroundColor: "var(--lighter-purple)",
      maxWidth: 1200,
      display: "flex",
      flexDirection: width && width < 768 ? "column" : "row",
      width: '100%',
      padding: '15px 5px',
      margin:  width && width > 768 ? '35px auto' : '',
    }}
    gutter={16}
  >

    <Col
      sm={24}
      md={6}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
       <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
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
          name={"Total transactions"}
          value={totalTxns}
          style={{ marginTop: 10, height: 60 }}
        ></PriceCard>
        <PriceCard
          formatted={true}
          up={true}
          name={"Total users"}
          value={totalSignUps + 25000}
          style={{ marginTop: 10, height: 60 }}
        ></PriceCard>
      </div>
      
    </Col>
    <Col
      sm={24}
      md={18}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        flexGrow: 1,
        padding: '10px',
        order: width && width < 768 ? -1 : undefined
      }}
    >
     <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis 
          dataKey={'time'}
          padding={{ right: 10, left: 10 }}
          stroke="transparent"
          dy={10}
          tick={{ fill: '#ddd' }}
        />
        <YAxis 
          padding={{top: 10, bottom: 10}}
          tick={{fill: '#ddd'}}
          stroke="rgba(250,250,250,0.5)"
          yAxisId="left"
          orientation="left"
          dataKey={valueKey}
        />
        <Line
          isAnimationActive={false}
          type="natural"
          yAxisId="left"
          dot={false}
          activeDot={false}
          dataKey={valueKey}
          stroke="#4a1faf"
        />
        <Tooltip  />
         <Legend
              content={({ payload }) => {
                const last: any = data[data.length - 1];
                return (
                  <ul
                    style={{
                      display: "flex",
                      listStyleType: "none",
                      color: "#fff",
                      justifyContent: "flex-end",
                      flexDirection: "row",
                      alignItems: "flex-end",
                      marginBottom: 10,
                      marginTop: 20
                    }}
                  >
                    {payload &&
                      payload.map((entry, index) => {
                        return (
                          <li
                            key={`item-${index}`}
                            style={{
                              fontSize: 16,
                              margin: "0 5px",
                              display: "flex",
                              alignItems: "center",
                              borderLeft: `2px solid ${entry.color}`,
                              padding: "0 5px"
                            }}
                          >
                            Wallet signups
                          </li>
                        );
                      })}
                  </ul>
                );
              }}
              verticalAlign="bottom"
              height={30}
            />
      </LineChart>
    </ResponsiveContainer>
    </Col>

  </Row>
  )
};


export default WalletsChart;
