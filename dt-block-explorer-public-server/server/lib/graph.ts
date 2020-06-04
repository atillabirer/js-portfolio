import { Graph } from "../model";
import request from "request-promise";
import { web3, contract } from "./web3";

export const fetchHist = async () => {
  const res = await request(
    "https://fmc.dtcoin.tech/market/API/histDataEuro.php"
  ).catch(e => {
    throw new Error();
  });
  Promise.all(
    JSON.parse(res).Data.map(({ low: close, time }: any) => {
      const timeStamp = new Date(parseInt(time));
      return new Graph({ close, timeStamp }).save();
    })
  ).then(data => {
    console.log("done");
  });
};
const fetchCurrent = async () => {
  const supply = await fetchSupply();
  const rawClose = await request(
    "https://fmc.dtcoin.tech/market/API/getDTCValue.php"
  );
  const close = rawClose / Math.pow(10, 6);
  return [supply, close];
};
const fetchSupply = async () => {
  return await contract.methods.totalSupply().call();
};

export const graphListener = async () => {
  const timeStamp = new Date();
  const [supply, close] = await fetchCurrent();
  console.log(supply, close, timeStamp);
  return await new Graph({ supply, close, timeStamp }).save();
};
