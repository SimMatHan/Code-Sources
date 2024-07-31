const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore();

exports.deleteOldRequests = functions.pubsub.schedule('0 0,12 * * *')
  .timeZone('Europe/Copenhagen') // Ensure the time zone is set to Danish time
  .onRun(async (context) => {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const snapshot = await db.collection('requests').where('timestamp', '<', twelveHoursAgo.toISOString()).get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Deleted old requests.');
    return null;
  });

exports.createUser = functions.https.onCall(async (data, context) => {
  const { username } = data;

  if (!username) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a username.');
  }

  const usersRef = db.collection('users');
  const querySnapshot = await usersRef.where('username', '==', username).get();

  if (!querySnapshot.empty) {
    throw new functions.https.HttpsError('already-exists', 'The username already exists.');
  }

  await usersRef.add({ username });
  return { message: 'User created successfully.' };
});

exports.signInUser = functions.https.onCall(async (data, context) => {
  const { username } = data;

  if (!username) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a username.');
  }

  const usersRef = db.collection('users');
  const querySnapshot = await usersRef.where('username', '==', username).get();

  if (querySnapshot.empty) {
    // User does not exist, create a new user
    await usersRef.add({ username });
    return { message: 'User created successfully.', username };
  } else {
    // User exists, return the user data
    const user = querySnapshot.docs[0].data();
    return user;
  }
});


// New function to list users
exports.listUsers = functions.https.onCall(async (data, context) => {
  const usersRef = db.collection('users');
  const querySnapshot = await usersRef.get();

  const users = [];
  querySnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });

  return users;
});
