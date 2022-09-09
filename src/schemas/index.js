// schema for database objects
export const BackupOTPSchema = {
  name: 'Backupotps',
  properties: {
    _id: 'objectId',
    phone: 'string',
    pin: 'int',
    balance: 'string',
  },
  primaryKey: '_id',
};

export const TransactionSchema = {
  name: 'Transactions',
  properties: {
    _id: 'objectId',
    vendor: 'string',
    wallet: 'string',
    phone: 'string',
    amount: 'int',
    txhash: 'string?',
    status: 'string',
    created_at: 'date',
  },
  primaryKey: '_id',
};
