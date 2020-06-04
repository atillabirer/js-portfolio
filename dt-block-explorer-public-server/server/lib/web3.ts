import Web3 from "web3";
import { api } from "../config";

export const web3 = new Web3(new Web3.providers.HttpProvider(api));
export const contract = new web3.eth.Contract(
  [
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint128"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    }
  ],
  "0x777F88855294d263edACBa8F1eBCF51BE5bA0b05"
);
