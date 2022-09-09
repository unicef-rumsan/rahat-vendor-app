import Realm from 'realm';
import {BackupOTPSchema, TransactionSchema} from '../schemas';
import {REALM_PROJECT_ID} from 'react-native-dotenv';

// initialize realm with Your RealmApp ID...
const app = new Realm.App({id: REALM_PROJECT_ID, timeout: 10000});

// can implement inBuilt JWT, Google, Facebook, Apple Authentication Flow.
const credentials = Realm.Credentials.anonymous(); // LoggingIn as Anonymous User.
// Enables offline-first: opens a local realm immediately without waiting
// for the download of a synchronized realm to be completed.
const OpenRealmBehaviorConfiguration = {
  type: 'openImmediately',
};

const getRealm = async () => {
  try {
    // loggedIn as anonymous user
    await app.logIn(credentials);
  } catch (err) {
    console.error('Failed to log in', err);
  }
  const configuration = {
    schema: [BackupOTPSchema, TransactionSchema],
    sync: {
      user: app.currentUser,
      partitionValue: 'myPartition',
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  };

  return Realm.open(configuration);
};

export default getRealm;
