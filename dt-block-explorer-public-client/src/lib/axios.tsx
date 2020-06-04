import Axios from "axios";

export const instance = Axios.create({
  baseURL: process.env.REACT_APP_ENDPOINT || "https://stagingtokensfun.ml"
});
