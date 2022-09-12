// schema for database objects
export const BackupOTPSchema = {
  name: 'Backupotps',
  properties: {
    _id: 'objectId',
    phone: 'int',
    pin: 'string',
    balance: 'int',
  },
  primaryKey: '_id',
};

export const TransactionSchema = {
  name: 'Transactions',
  properties: {
    _id: 'objectId',
    vendor: 'string',
    pin: 'string',
    phone: 'int',
    amount: 'int',
    txhash: 'string?',
    status: 'string',
    created_at: 'date',
  },
  primaryKey: '_id',
};
