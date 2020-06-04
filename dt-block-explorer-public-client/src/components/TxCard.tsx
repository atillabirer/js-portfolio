import React from "react";
import { Col, Row, Typography, Icon } from "antd";
import { Card, useWindowSize } from "../lib";
import { Link } from "react-router-dom";
const { Title, Text } = Typography;
export const TxCard: React.FC<{
  type?: "Success" | "Pending" | "Failed";
  data?: any;
}> = ({ type, data }) => {
  const typeStyle = {
    backgroundColor:
      type === "Success"
        ? "#8eff8e"
        : type === "Failed"
        ? "#ff8787"
        : "#fff65b",
    color: type === "Success" ? "green" : type === "Failed" ? "red" : "#a59d00"
  };
  const { width } = useWindowSize();
  return (
    <Row style={{ width: "100%", display: "flex", margin: "16px 0" }}>
      <Col
        span={24}
        style={{
          minHeight: 120
        }}
        className="column"
      >
        <Card
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: width && width < 768 ? "column" : "row"
          }}
          bordered
        >
          <Col md={20} sm={24} style={{ padding: 20 }}>
            <div
              style={{
                marginBottom: 10,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              <Text
                style={{ color: "#4a1faf", fontWeight: 600, width: "100%" }}
              >
                {data?.hash}
              </Text>
            </div>

            <div
              style={{
                marginBottom: 10,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              <Text>
                <Link to="#">{data?.from}</Link>
              </Text>
              <div
                className={
                  width && width < 768 ? "justify-center-all" : undefined
                }
              >
                <Icon
                  style={{ margin: "0 10px", color: "#1890ff" }}
                  type="caret-right"
                />
              </div>
              <Text>
                <Link to="#">{data?.to}</Link>
              </Text>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Text>{new Date(data?.timestamp).toString()}</Text>
            </div>
            <div>
              <Text>
                Block{" "}
                <Link style={{ color: "#4a1faf", fontWeight: 600 }} to={`#`}>
                  #{data?.blockNumber}
                </Link>
              </Text>
            </div>
          </Col>
          <Col
            className={`justify-center-all ${
              width && width > 768 ? "height-100" : ""
            }`}
            md={4}
            sm={24}
          >
            <Title level={3} style={{ color: "rgb(84, 84, 84)" }}>
              {data?.value / Math.pow(10, 18)} DTC
            </Title>
          </Col>
        </Card>
      </Col>
    </Row>
  );
};
