import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { Dropdown, Menu, Button } from "antd";
import { ClimbingBoxLoader } from "react-spinners";
import moment from "moment";
import { instance, useWindowSize } from "../lib";
import { format } from "d3-format";
const formatter = (type: "FULL" | "CON") => {
  return (num: number) => {
    if (num / Math.pow(10, 12) > 1) {
      return `${(num / Math.pow(10, 12)).toFixed(type == "CON" ? 0 : 3)} ${
        type == "FULL" ? "Trillion" : "T"
      }`;
    } else if (num / Math.pow(10, 9) > 1) {
      return `${(num / Math.pow(10, 12)).toFixed(type == "CON" ? 0 : 3)} ${
        type == "FULL" ? "Billion" : "B"
      }`;
    } else if (num / Math.pow(10, 6) > 1) {
      return `${(num / Math.pow(10, 6)).toFixed(type == "CON" ? 0 : 3)} ${
        type == "FULL" ? "Million" : "M"
      }`;
    } else if (num / Math.pow(10, 3) > 1) {
      return `${(num / Math.pow(10, 3)).toFixed(type == "CON" ? 0 : 3)}K`;
    }
    return num;
  };
};
 
export const Chart = () => {
  const { width } = useWindowSize();
  const Tick: React.FC<any> = ({
    payload: { value },
    verticalAnchor,
    visibleTicksCount,
    fill,
    ...rest
  }) => (
    <text {...rest} fill="#ddd" className="bar-chart-tick" dy={15}>
      {moment(new Date(value)).format("DD/MM")}
    </text>
  );
  const [currencyVals, setCurrencyVals] = React.useReducer(
    (
      _: { currency: string; rate: string }[],
      incoming: { data: { currency: string; rate: string }[] }
    ) => [{ currency: "EUR", rate: "1" }, ...incoming.data],
    [{ currency: "EUR", rate: "1" }]
  );
  const [currency, setCurrency] = React.useState("EUR");
  const legendFormatter = currency == "BTC" ? format(",.8f") : format(",.2f");
  const [_data, setData] = React.useReducer(
    (_prevState: any[], { data, currencyVal }: any) =>
      data.map((d: any, i: number) => {
        const res = currencyVals.filter(
          d => d.currency == (currencyVal || currency)
        );
        let closev = d.close,
          mkc;
        if (res[0]) {
          closev = parseFloat(d.close) * parseFloat(res[0].rate);
        }
        return {
          time: d.timeStamp || d.time,
          key: i,
          Price: closev,
          close: d.close,
          "Market Cap": (closev * d.supply) / Math.pow(10, 18),
          supply: d.supply
        };
      }),
    []
  );
  const symbol =
    currency == "USD"
      ? "$"
      : currency == "EUR"
      ? "€"
      : currency == "CNY"
      ? "¥"
      : "";
  function onDropdownChange(d: string) {
    setData({ data: _data, currencyVal: d });
  }
  function getData() {
    instance
      .post("/api/graph", { count: 30 })
      .then(data => setData({ ...data, currencyVal: currency }))
      .catch(console.error);
    instance
      .get("/api/prices")
      .then(setCurrencyVals)
      .catch(console.error);
  }
  React.useEffect(() => {
    getData();
  }, []);
  const isDesktop = width && width > 768;
  const enabledCurrencies = ["EUR", "USD", "CNY", "BTC"];
  const menu = () => (
    <Menu>
      {enabledCurrencies.map((d: string) => (
        <Menu.Item
          key={d}
          onClick={e => {
            setCurrency(d);
            onDropdownChange(d);
          }}
        >
          <a href="#">{d}</a>
        </Menu.Item>
      ))}
    </Menu>
  );
  return _data.length > 0 ? (
    <div
      style={
        !!isDesktop
          ? { width: "100%" }
          : {
              display: "flex",
              flexDirection: "column",
              width: "100%",
              marginBottom: 20
            }
      }
    >
      <div style={{ padding: "20px 10px 25px 0px", width: "100%" }}>
        <ResponsiveContainer height={300} width="98%">
          <LineChart data={_data}>
            <XAxis
              dataKey={"time"}
              padding={{ right: 10, left: 10 }}
              stroke="transparent"
              dy={10}
              tick={<Tick />}
            />
            <YAxis
              domain={_data.reduce(([min, max]: [number, number], entry: { Price: number }) => {
                let newMin = min;
                let newMax = max;
                if (entry.Price < min) {
                  newMin = Math.floor(entry.Price);
                }

                if (entry.Price > max) {
                  newMax = Math.ceil(entry.Price);
                }

                return [newMin, newMax];
              }, [Math.floor(_data[0].Price), Math.ceil(_data[0].Price)])}
              dx={-10}
              padding={{ top: 10, bottom: 10 }}
              tick={{ fill: "#ddd" }}
              stroke="rgba(250,250,250,0.5)"
              yAxisId="left"
              orientation="left"
            />
            <YAxis
              domain={_data.reduce(([min, max]: [number, number], entry: { 'Market Cap': number }) => {
                let newMin = min;
                let newMax = max;
                if (entry['Market Cap'] < min) {
                  newMin = Math.floor(entry['Market Cap']);
                }

                if (entry['Market Cap'] > max) {
                  newMax = Math.ceil(entry['Market Cap']);
                }

                return [newMin, newMax];
              }, [Math.floor(_data[0]['Market Cap']), Math.ceil(_data[0]['Market Cap'])])}
              dx={10}
              padding={{ top: 10, bottom: 10 }}
              tick={{ fill: "#ddd" }}
              stroke="rgba(250,250,250,0.5)"
              yAxisId="right"
              orientation="right"
              tickFormatter={formatter("CON")}
            />
            <Tooltip />
 
            <Line
              isAnimationActive={false}
              type="natural"
              yAxisId="left"
              dot={false}
              activeDot={false}
              dataKey="Price"
              stroke="#af7d1f"
            />
            <Line
              isAnimationActive={false}
              type="natural"
              yAxisId="right"
              dot={false}
              activeDot={false}
              dataKey="Market Cap"
              stroke="#82ca9d"
            />
            <Legend
              content={({ payload }) => {
                const last: any = _data[_data.length - 1];
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
                            {entry.value}:{"  "}
                            {index == 0
                              ? `${symbol}${legendFormatter(last[entry.value])}`
                              : `${symbol}${formatter("FULL")(
                                  last[entry.value]
                                )}`}
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
      </div>
      <Dropdown
        overlay={menu}
        placement={width && width > 768 ? "topLeft" : "bottomCenter"}
      >
        <Button
          style={{
            position: width && width > 768 ? "absolute" : "relative",
            bottom: width && width > 768 ? 10 : undefined,
            left: width && width > 768 ? 10 : undefined,
            backgroundColor: "rgb(93, 40, 217)",
            color: "#fff",
            zIndex: 99,
            marginTop: '10%',
            width: width && width > 768 ? undefined : "100%"
          }}
        >
          {currency}
        </Button>
      </Dropdown>
    </div>
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 200,
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
      }}
    >
      <ClimbingBoxLoader color="#fff"></ClimbingBoxLoader>
    </div>
  );
};
