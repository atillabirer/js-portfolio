import React from "react";
import { Layout } from "./";
import { PriceCard, GraphCard, Chart, BlockCard } from "../components";
import { Card, Row, useWindowSize, instance } from "../lib";
import { Pagination, Col, Typography } from "antd";
import { HashLoader } from "react-spinners";
import { orderBy } from "lodash";
import useInterval from "use-interval";
import TransactionsChart from '../components/TransactionsChart';
import WalletsChart from "../components/WalletsChart";

const { Title } = Typography;

export const Dashboard: React.FC = () => {
  const [prices, _setPrices] = React.useState([
    { key: 4, name: "Unique Users", value: 16000 }
  ]);
  const { width } = useWindowSize();
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [offset, setOffset] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [totalTxns, setTotalTxns] = React.useReducer(
    (_: number, { data }: any) => data,
    0
  );
  const [blockTime, setAverageBlockTime] = React.useReducer(
    (currentVal: number, [val1, val2]: number[]) => val1 - val2,
    0
  );
  const [blockList, setBlockList] = React.useState<any[]>([]);
  function getData(_offset?: number) {
    setLoading(true);
    setBlockList([]);

    instance
      .post("/api/blocklist", { offset: _offset || offset })
      .then(({ data }) => {
        setLoading(false);
        const blocklist = orderBy(data, ["number"], ["desc"]);
        setBlockList(blocklist);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
        setErr(true);
      });
  }
  function getBaseData(_offset?: number) {
    setBlockList([]);
    setLoading(true);
    instance.get("/api/txns").then(setTotalTxns);
    instance
      .get("/api/current")
      .then(({ data }) => {
        setTotalPages(data.number - 25);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
        setErr(true);
      });
    instance
      .post("/api/blocklist", { offset: 0 })
      .then(({ data }) => {
        setBlockList([]);
        const blocklist = orderBy(data, ["number"], ["desc"]);
        setBlockList(blocklist);
        setAverageBlockTime([blocklist[0]?.timestamp, blocklist[1]?.timestamp]);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
        setErr(true);
      });
  }
  useInterval(() => {
    getBaseData();
  }, 300000);
  React.useEffect(() => {
    getBaseData();
  }, []);
  function onChange(page: number) {
    setOffset(page * 25);
    getData(page * 25);
  }
  return (
    <Layout down={!loading && err}>
      <Row
        style={{
          backgroundColor: "var(--lighter-purple)",
          maxWidth: 1200,
          display: "flex",
          flexDirection: width && width < 768 ? "column" : "row"
        }}
        width="100%"
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
          <Chart></Chart>
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
              formatted={false}
              up={false}
              name={"Avg. Block Time"}
              value={`${blockTime.toFixed(1)} sec`}
              style={{ marginTop: 0, height: 60 }}
            ></PriceCard>
            <PriceCard
              formatted={true}
              up={true}
              name={"Total Blocks"}
              value={`${totalPages + 1}`}
              style={{ marginTop: 10, height: 60 }}
            ></PriceCard>
          </div>
        </Col>
      </Row>

      <WalletsChart totalTxns={totalTxns} />

      <TransactionsChart />

      <Row
        style={{ maxWidth: 1200 }}
        margin={{ top: 16 }}
        gutter={16}
        width="100%"
        display="flex"
        padding="0 8px"
      >
        <Card
          style={{
            padding: 16
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Title level={3}>Blocks</Title>
          </div>
          {blockList.length > 0 ? (
            blockList.map((d, i) => <BlockCard key={i} data={d}></BlockCard>)
          ) : (
            <div className="justify-center-all" style={{ height: 200 }}>
              <HashLoader color="#4a1faf"></HashLoader>
            </div>
          )}
          <div className="justify-center-all">
            <Pagination
              defaultCurrent={1}
              onChange={onChange}
              pageSize={25}
              total={totalPages}
            ></Pagination>
          </div>
        </Card>
      </Row>
    </Layout>
  );
};
