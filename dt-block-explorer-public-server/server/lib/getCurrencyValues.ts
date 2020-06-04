import request from "request-promise";
import { parseString } from "xml2js";

export const getCurrencyValues = (): Promise<{
  currency: string;
  rate: number;
}[]> => {
  return new Promise(async (resolve, reject) => {
    const str = await request
      .get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")
      .catch(reject);
    parseString(str, { trim: true }, async (err, result) => {
      if (err) reject(err);
      let ans: { currency: string; rate: number }[] = result["gesmes:Envelope"][
        "Cube"
      ][0]["Cube"][0]["Cube"].map((d: any, index: number) => {
        return d["$"];
      });
      ans.push({
        currency: "BTC",
        rate: await request
          .get("https://blockchain.info/tobtc?currency=EUR&value=1")
          .catch(reject)
      });
      resolve(ans);
    });
  });
};
