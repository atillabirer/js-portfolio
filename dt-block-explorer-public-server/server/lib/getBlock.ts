import request from 'request-promise';
import { api } from '../config';
import { Block } from '../typings';

export const getBlock: (config: {
  number: string | number;
}) => Promise<Block> = async ({ number }) => {
  const block = await (
    await request(api, {
      body: {
        method: 'idx_getBlock',
        params: [number]
      },
      json: true,
      method: 'POST'
    }).catch(console.error)
  ).result;
  if (block == '') {
    throw new Error();
  }
  return block;
};
