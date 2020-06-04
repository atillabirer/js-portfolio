import request from 'request-promise';
import { api } from '../config';
import { Block } from '../typings';

export const getCurrentBlock: () => Promise<Block> = async () => {
  return await (
    await request(api, {
      body: {
        method: 'idx_getLatest',
        params: []
      },
      json: true,
      method: 'POST'
    }).catch(console.error)
  ).result;
};
