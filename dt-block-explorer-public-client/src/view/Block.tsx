import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from "./";
import { Typography, Col, Pagination } from "antd";
import { GraphCard, TxCard } from "../components";
import moment from "moment";
import axios from "axios";
import {
  Row,
  BlockText,
  Card,
  BlockDetails,
  useWindowSize,
  instance
} from "../lib";

const { Title, Text } = Typography;

export const Block: React.FC = () => {
  const { height } = useParams();
  const { width } = useWindowSize();
  const [block, setBlock] = React.useState<any>({});
  console.log(height);
  function onChange(page: any, pageSize: any) {
    console.log(page);
  }
  function getBlock() {
    instance.get("/api/block/" + height).then(({ data }) => {
      setBlock(data);
    });
  }
  React.useEffect(() => {
    getBlock();
  }, []);
  return (
    <Layout>
      <Row
        margin={{ top: 16 }}
        gutter={16}
        style={{
          maxWidth: 1200,
          display: "flex",
          flexDirection: width && width < 768 ? "column" : "row"
        }}
      >
        <GraphCard margin={{ right: 16, left: 16 }} md={24} sm={24}>
          <div
            style={{
              width: "100%",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "30px 20px 25px 20px",
                marginBottom: block.number ? 25 : 0,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                backgroundColor: "#2D136B",
                borderRadius: block.number ? undefined : 4
              }}
            >
              <Title
                level={2}
                style={{
                  fontSize: "1.8em",
                  color: "#fff"
                }}
              >
                {block.number ? "Block Details" : "Loading Block Details"}
              </Title>

              {block.number && (
                <>
                  <BlockText color="inverted" type="STRONG" title="Number">
                    {block.number}
                  </BlockText>
                  <BlockDetails
                    color="inverted"
                    time={moment(new Date(block.timestamp * 1000)).fromNow()}
                    transactions={block.transactions}
                  ></BlockDetails>
                </>
              )}
            </div>
            {block.number && (
              <div
                style={{
                  padding: "0px 20px 20px 20px"
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 14
                  }}
                >
                  <Text>Hash: {block.hash}</Text>
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 14
                  }}
                >
                  <Text>Parent Hash: {block.parentHash}</Text>
                </div>
                <BlockText title="Difficulty">{block.difficulty}</BlockText>
                <BlockText title="Nonce">{block.nonce}</BlockText>
                <BlockText title="Gas Used">{block.gasUsed}</BlockText>
              </div>
            )}
          </div>
        </GraphCard>
      </Row>
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
            <Title level={3}>Transactions</Title>
            {block.transactions > 0 && (
              <Pagination
                defaultCurrent={1}
                onChange={onChange}
                pageSize={25}
              ></Pagination>
            )}
          </div>
          {block?.transactions == 0 ? (
            "No Transactions on this block"
          ) : block.transactions ? (
            <>
              {block?.tokenTransactions.map((d: any) => (
                <TxCard data={d}></TxCard>
              ))}
            </>
          ) : (
            "Loading Block Details"
          )}
        </Card>
      </Row>
    </Layout>
  );
};
