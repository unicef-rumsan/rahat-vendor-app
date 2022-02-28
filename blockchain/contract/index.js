import {ethers} from 'ethers';
import erc20 from './erc20.json';

export default function Contract({wallet, address, type}) {
  // const files = {
  //   erc20: require('./erc20'),
  //   erc721: require('./erc721'),
  // };

  const getAbi = async () => {
    return import('./erc20.json');
    // return files[type];
  };

  return {
    // abi: getAbi(),
    get() {
      // return new ethers.Contract(address, getAbi(), wallet);
      return new ethers.Contract(address, erc20, wallet);
    },
  };
}
