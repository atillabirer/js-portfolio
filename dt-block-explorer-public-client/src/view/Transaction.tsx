import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from "./";
import { Typography, Icon } from "antd";
import { GraphCard } from "../components";
import { Row } from "../lib";
import { Col } from "antd";

const { Title, Text } = Typography;

export const Transactions: React.FC = () => {
  const { hash } = useParams();

  return (
    <Layout>
      <Row margin={{ top: 16 }}>
        <Col span={24}>
          <GraphCard>
            <div
              style={{
                minHeight: 200,
                width: "100%",
                flexDirection: "column",
                padding: 20
              }}
            >
              <Title level={3}>Details</Title>
              <Text strong>Hash: {hash}</Text>
              <br />
              <Text strong>
                From: <a href="#">0x4808A49bFB7527C142eb2C5b5718CeF432223ae7</a>
              </Text>
              <br />
              <Text strong>
                To: <a href="#">0x2072699Fe4E3Ab5F20a0b16CaA5dfF9303443358</a>
              </Text>
              <br />
              <Text strong>
                Value: <a href="#">1337 DTC</a>
              </Text>
              <br />
              <Text strong>
                Contract:{" "}
                <a href="#">0x4808A49bFB7527C142eb2C5b5718CeF432223ae7</a>
              </Text>
              <br />
              <Text strong>
                Method: <a href="#">Ayy Lmao</a>
              </Text>
              <br />
              <Text strong>
                Status: <a href="#">6 Confirmations</a>
              </Text>
              <br />
            </div>
          </GraphCard>
        </Col>
      </Row>
    </Layout>
  );
};
