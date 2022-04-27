import Aes from 'react-native-aes-crypto';
import {ENCRYPTION_CODE, ENCRYPTION_SALT} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length);

const encryptData = async (text, key) => {
  const iv = await Aes.randomKey(16);
  const cipher = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
  return {
    cipher,
    iv,
  };
};

const encryptionHelper = async (data, code) => {
  const key = await generateKey(code, ENCRYPTION_SALT, 5000, 256);
  return encryptData(JSON.stringify(data), key)
    .then(async ({cipher, iv}) => {
      const result = {cipher, iv};
      return result;
    })
    .catch(error => {
      throw error;
    });
};

const decryptData = (encryptedData, key) =>
  Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc');

const decryptionHelper = async (cipher, iv, code) => {
  const key = await generateKey(code, ENCRYPTION_SALT, 5000, 256);
  return decryptData({cipher, iv}, key)
    .then(walletInfo => {
      return JSON.parse(walletInfo);
    })
    .catch(error => {
      throw error;
    });
};

const truncateString = str => {
  if (str.length > 50) {
    return str.slice(0, 25) + '...';
  } else {
    return str;
  }
};

const getPackageDetail = async (obj, type) => {
  let tokenIds;
  if (type === 'getPackages') {
    tokenIds = obj.tokenIds?.map(t => t);
  } else {
    tokenIds = obj.tokenIds?.map(t => t?.toNumber());
  }
  try {
    let packages = [];
    await Promise.all(
      tokenIds?.map(async (item, index) => {
        let balance;
        if (type === 'getPackages') {
          balance = obj.balances[index];
        } else {
          balance = obj.balances[index].toNumber();
        }
        const response = await axios.get(
          `https://agency-nft.rahat.io/api/v1/nft/token/${item}`,
        );
        const data = response.data;
        // balance = (type = 'getPackages'
        //   ? obj.balances[index]
        //   : obj.balances[index].toNumber());
        const pkg = {
          tokenId: data.tokenId,
          name: data.name,
          symbol: data.symbol,
          description:
            data.metadata && data.metadata.description
              ? data.metadata.description
              : '',
          value:
            data.metadata && data.metadata.fiatValue
              ? data.metadata.fiatValue
              : '',
          imageUri:
            data.metadata && data.metadata.packageImgURI
              ? data.metadata.packageImgURI
              : '',
          balance,
        };
        packages = [...packages, pkg];
      }),
    );
    return packages;
  } catch (e) {
    console.log(e);
  }
};

const getPackages = async (data, dataType) => {
  try {
    let packages = await getPackageDetail(data, dataType);
    let temp = [];
    packages?.map(res => {
      if (temp.length > 0) {
        if (temp.some(i => i.tokenId === res.tokenId)) {
          temp.map(tempItem => {
            if (res.tokenId === tempItem.tokenId) {
              return (tempItem.balance = tempItem.balance + res.balance);
            }
          });
          return;
        }
      }
      temp = [...temp, res];
    });
    return temp;
  } catch (e) {
    alert(e);
  }
};

const getCombinedPackages = packages => {
  let temp = [];
  packages?.map(res => {
    if (temp.length > 0) {
      if (temp.some(i => i.tokenId === res.tokenId)) {
        temp.map(tempItem => {
          if (res.tokenId === tempItem.tokenId) {
            return (tempItem.amount = tempItem.amount + res.amount);
          }
        });
        return;
      }
    }
    temp = [...temp, res];
  });
  return temp;
};

const getActiveAgencyTransactions = (activeAppSettings, transactions) => {
  try {
    if (transactions?.length) {
      console.log(transactions[0])
      const filteredTransactions = transactions?.filter(
        item => item?.agencyUrl === activeAppSettings?.agencyUrl,
      );
      return filteredTransactions;
    }
    return [];
  } catch (e) {
    alert(e);
  }
};

export {
  encryptionHelper,
  decryptionHelper,
  truncateString,
  getPackageDetail,
  getPackages,
  getActiveAgencyTransactions,
  getCombinedPackages,
};
