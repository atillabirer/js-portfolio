import request from "request-promise";
import { api } from "../config";
import { Block } from "../typings";

export const getTotalTransactions: () => Promise<number> = async () => {
  return await (
    await request(api, {
      body: {
        method: "idx_getLatestTokenTransfers",
        params: [1]
      },
      json: true,
      method: "POST"
    }).catch(console.error)
  )?.result?.total;
};
