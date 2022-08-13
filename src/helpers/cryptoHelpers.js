import Aes from 'react-native-aes-crypto';
// import {ENCRYPTION_CODE, ENCRYPTION_SALT} from '@env';

const ENCRYPTION_SALT = 'M0OH8JKLAY89BAdDenAsd83221'

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

export const encryptionHelper = async (data, code) => {
  const key = await generateKey(code, ENCRYPTION_SALT, 5000, 256);
  return encryptData(JSON.stringify(data), key)
    .then(async ({ cipher, iv }) => {
      const result = { cipher, iv };
      return result;
    })
    .catch(error => {
      throw error;
    });
};

const decryptData = (encryptedData, key) =>
  Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc');

export const decryptionHelper = async (cipher, iv, code) => {
  const key = await generateKey(code, ENCRYPTION_SALT, 5000, 256);
  return decryptData({ cipher, iv }, key)
    .then(walletInfo => {
      return JSON.parse(walletInfo);
    })
    .catch(error => {
      throw error
    });
};