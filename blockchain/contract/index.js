import {ethers} from 'ethers';
import erc20 from './erc20.json';

export default function Contract({wallet, address, type}) {
  return {
    get() {
      return new ethers.Contract(address, erc20, wallet);
    },
  };
}
