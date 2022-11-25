import getRealm from '../database';
import {ObjectId} from 'bson';

const addTransaction = async payload => {
  let newData;
  const instance = await getRealm();

  instance.write(async () => {
    newData = instance.create('Transactions', {
      _id: new ObjectId(),
      _partition: 'myPartition',
      ...payload,
    });
  });
  return newData;
};

const searchTxn = async query => {
  if (query.length > 2) {
    try {
      const instance = await getRealm();
      const allData = instance.objects('Transactions');
      const filteredData = allData.filtered(`phone == '${query}'`);
      return filteredData;
    } catch (e) {
      console.log('ERR:', e);
    }
  }
};

export {addTransaction, searchTxn};
