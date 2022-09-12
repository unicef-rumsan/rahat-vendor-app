// schema for database objects
export const BackupOTPSchema = {
  name: 'Backupotps',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    phone: 'string',
    pin: 'string',
    balance: 'int',
  },
  primaryKey: '_id',
};

export const TransactionsSchema = {
  name: 'Transactions',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    amount: 'int',
    created_at: 'date',
    phone: 'int',
    pin: 'string?',
    status: 'string',
    txhash: 'string?',
    vendor: 'string',
  },
  primaryKey: '_id',
};
