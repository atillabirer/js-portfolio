import request from 'request-promise';
import { api } from '../config';
import { TokenTransfer } from '../typings';

export const getBlockTokenTransfers: (config: {
  number: string | number;
}) => Promise<TokenTransfer> = async ({ number }) => {
  console.log('getblock called');
  return await (
    await request(api, {
      body: {
        method: 'idx_getBlockTokenTransfers',
        params: [number]
      },
      json: true,
      method: 'POST'
    }).catch(console.error)
  ).result;
};
