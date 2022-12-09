// schema for database objects
export const BackupOTPSchema = {
  name: 'Backupotps',
  properties: {
    _id: 'objectId',
    phone: 'string',
    pin: 'string',
    ward: 'string',
    name: 'string',
    balance: 'int',
  },
  primaryKey: '_id',
};

export const TransactionsSchema = {
  name: 'Transactions',
  properties: {
    _id: 'objectId',
    amount: 'int',
    created_at: 'date',
    phone: 'int',
    pin: 'string?',
    status: 'string',
    txhash: 'string?',
    isOffline: {type: 'bool', default: false},
    isQR: {type: 'bool', default: false},
    otpDuration: 'string?',
    vendor: 'string',
    txnStart: 'string?',
    txnEnd: 'string?',
  },
  primaryKey: '_id',
};
