import Aes from 'react-native-aes-crypto';
import {ENCRYPTION_CODE, ENCRYPTION_SALT} from '@env';

console.log(ENCRYPTION_CODE, ENCRYPTION_SALT)

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

const encryptionHelper = async data => {
  const key = await generateKey(ENCRYPTION_CODE, ENCRYPTION_SALT, 5000, 256);
  return encryptData(JSON.stringify(data), key)
    .then(async ({cipher, iv}) => {
      const result = {cipher, iv};
      return result;
    })
    .catch(error => {
      return error;
    });
};

const decryptData = (encryptedData, key) =>
  Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc');

const decryptionHelper = async (cipher, iv) => {
  const key = await generateKey(ENCRYPTION_CODE, ENCRYPTION_SALT, 5000, 256);
  return decryptData({cipher, iv}, key)
    .then(walletInfo => {
      return JSON.parse(walletInfo);
    })
    .catch(error => {
      return error;
    });
};

export {encryptionHelper, decryptionHelper};
