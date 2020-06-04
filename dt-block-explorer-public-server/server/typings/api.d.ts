export interface Block {
  difficulty: Number;
  gasLimit: Number;
  gasUsed: Number;
  hash: String;
  miner: String;
  number: Number;
  parentHash: String;
  sha3Uncles: String;
  timestamp: Number;
  totalDifficulty: Number;
  nonce: String;
  extraData: String;
  transactions: Number;
  uncles: Number;
  avgGasPrice: Number;
  txFees: Number;
  sort?: number;
  tokenTransactions: any;
}
export interface TokenTransfer {
  logs: any[];
  txn_id: string;
  blockNumber: number;
  hash: string;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  contract: string;
  method: string;
  status: boolean;
}
