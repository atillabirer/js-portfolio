import React from "react";
import { Layout as ANTDLayout } from "antd";
import { Navbar } from "../components";
import { useWindowSize } from "../lib";
const { Header, Content, Footer } = ANTDLayout;

export const Layout: React.FC<{ footerText?: string; down?: boolean }> = ({
  children,
  footerText = process.env.REACT_APP_FOOTER_TEXT ||
    "DT ® All Rights Reserved 2020",
  down
}) => {
  const { width } = useWindowSize();
  return (
    <ANTDLayout
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--lighter-purple)"
      }}
    >
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          backgroundColor: "var(--ligher-purple)",
          display: "flex",
          justifyContent: "center",
          padding: width && width < 768 ? 0 : undefined
        }}
      >
        <Navbar down={down}></Navbar>
      </Header>
      <Content
        style={{
          marginTop: 64,
          display: "flex",
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          padding: "5px 20px 20px 20px"
        }}
      >
        {children}
      </Content>
      <Footer
        style={{
          textAlign: "center",
          color: "#ddd",
          backgroundColor: "transparent"
        }}
      >
        {footerText}
      </Footer>
    </ANTDLayout>
  );
};
