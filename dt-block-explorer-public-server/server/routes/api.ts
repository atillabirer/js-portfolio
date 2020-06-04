import { Router } from "express";
import {
  getBlock,
  getBlockTokenTransfers,
  getCurrentBlock,
  getTotalTransactions,
  getCurrencyValues,
  getAnalyticsData
} from "../lib";
import { Block } from "../typings";
import { range, compact } from "lodash";
import { Graph } from "../model";

let currencies: { currency: string; rate: number }[] = [];

(async () => {
  currencies = await getCurrencyValues();
  setInterval(async () => {
    currencies = await getCurrencyValues();
  }, 600000);
})();

export const api = Router();

api.get("/block/:number", async (req, res) => {
  const number: number | string = req.params.number;

  let block = await getBlock({ number });
  block.tokenTransactions = await getBlockTokenTransfers({ number });
  res.json(block);
});
api.get("/tokenTransfers/:number", async (req, res) => {
  const tokenTxns = await getBlockTokenTransfers({ number: req.params.number });
  console.dir(tokenTxns);
  res.json(tokenTxns);
});
api.get("/current", async (req, res) => {
  const current = await getCurrentBlock();

  res.json(current);
});
api.post("/graph", async (req, res) => {
  const { count }: { count: number } = req.body;
  const graphCount = await Graph.countDocuments();
  if (count > graphCount) {
    res.json((await Graph.find().sort({ timeStamp: -1 })).reverse());
  } else {
    res.json(
      (
        await Graph.find()
          .sort({ timeStamp: -1 })
          .limit(count)
      ).reverse()
    );
  }
});
api.get("/txns", async (req, res) => {
  res.json(await getTotalTransactions());
});
api.get("/prices", async (req, res) => {
  res.json(currencies);
});
api.post("/blocklist", async (req, res) => {
  const { offset }: { offset: number } = req.body;

  const current = await getCurrentBlock();
  Promise.all(
    compact(
      range(
        current.number.valueOf() - offset - 24,
        current.number.valueOf() - offset + 1
      ).map(d => {
        if (d > 0) {
          return getBlock({ number: d });
        } else {
          return undefined;
        }
      })
    )
  )
    .then(blocks => {
      res.json(blocks);
    })
    .catch(e => {
      res.json([]);
    });
});

/**
 * Transactions per second, random number between 9000  and 11000
 */
api.get('/tps', (req, res) => {
  res.json({
    // The math.round bit is so we get 2 decimal places only
    tps: Math.round((9000 + (Math.random() * (11000 - 9000))) * 100)/100,
  })
})

api.get('/wallet_stats', async (req, res) => {
  try {
    const {data, ...result} = await getAnalyticsData();
    
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(422).json(e);
  }
})
