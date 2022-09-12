import getRealm from '../database';

const searchOTP = async query => {
  if (query.length > 2) {
    try {
      const instance = await getRealm();
      const allData = instance.objects('Backupotps');
      const filteredData = allData.filtered(`phone == '${query}'`);
      return filteredData;
    } catch (e) {
      console.log('ERR:', e);
    }
  }
};

export {searchOTP};
