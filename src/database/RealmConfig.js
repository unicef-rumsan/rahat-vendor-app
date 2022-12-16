import Realm from 'realm';
import * as Schemas from '../schemas';
import { REALM_APP_ID } from 'react-native-dotenv';
// initialize realm with Your RealmApp ID...
const app = new Realm.App({ id: REALM_APP_ID });
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
    const configuration = {
      schema: [Schemas.BackupOTPSchema, Schemas.TransactionsSchema],
      sync: {
        user: app.currentUser,
        partitionValue: 'myPartition',
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
      error: e => {
        console.log('getRealm Err: ', e);
      },
    };
    const data = await Realm.open(configuration);
    return data;
  } catch (err) {
    console.error('Failed to log in', err);
  }
};

export default getRealm;
