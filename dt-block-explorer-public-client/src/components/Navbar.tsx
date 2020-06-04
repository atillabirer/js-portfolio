import React from "react";
import { Menu, Typography, Icon } from "antd";
import { Link } from "react-router-dom";
import { useWindowSize } from "../lib";

const { Title } = Typography;
export const Navbar: React.FC<{ down?: boolean }> = ({ down }) => {
  const { width } = useWindowSize();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        maxWidth: 1200,
        width: "100%",
        padding: "0 10px"
      }}
      className="navbar"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Title style={{ margin: 0 }} level={2}>
          <Link to="/">
            {" "}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={require("../assets/logo.png")}
                style={{
                  height: "60px",
                  filter: "brightness(0) invert(1)"
                }}
                alt=""
              />
              <span style={{ marginLeft: 5, fontWeight: "bold" }}>
                Explorer
              </span>
            </div>
          </Link>
        </Title>
      </div>
      {width && width > 768 && <StatusNotif down={down}></StatusNotif>}
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        style={{ display: "flex", alignItems: "center" }}
      >
        <Menu.Item key="1">
          <a
            href={
              process.env.REACT_APP_DTWALLET_URL ||
              "https://explorer.dtwallet.io"
            }
          >
            Go to DTWallet
          </a>
        </Menu.Item>
      </Menu>
    </div>
  );
};

const StatusNotif: React.FC<{ down?: boolean }> = ({ down }) => (
  <div
    className="status-indicator"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Icon
      component={() => (
        <svg className="online-dot" height="10" width="10">
          <circle cx="5" cy="5" r="4" fill={down ? "red" : "#35a36e"} />
        </svg>
      )}
      style={{ color: "#35a36e", fontSize: 18, marginRight: 5 }}
    />{" "}
    {down ? "An error has occurred" : "The network is operational"}
  </div>
);
