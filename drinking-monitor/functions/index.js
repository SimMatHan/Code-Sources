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
