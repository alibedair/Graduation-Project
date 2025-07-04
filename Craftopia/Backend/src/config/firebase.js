const admin = require("firebase-admin");
require('dotenv').config();
const serviceAccount = require("./firebaseServiceAccount.json");

console.log('Firebase Database URL:', process.env.FIREBASE_DATABASE_URL);

if (!process.env.FIREBASE_DATABASE_URL) {
  console.error('ERROR: FIREBASE_DATABASE_URL environment variable is not set!');
  console.error('Please make sure to set FIREBASE_DATABASE_URL in your .env file or Docker environment');
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://craftopia-b79f8-default-rtdb.europe-west1.firebasedatabase.app/',
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const firebase_db = admin.database();
const firebase_auth = admin.auth();

const originalRef = firebase_db.ref;
firebase_db.ref = function() {
  const ref = originalRef.apply(firebase_db, arguments);
  
  const originalTransaction = ref.transaction;
  ref.transaction = function(updateFn, onComplete) {
    const callback = typeof onComplete === 'function' ? onComplete : () => {};
    return originalTransaction.call(ref, updateFn, callback);
  };
  
  return ref;
};

module.exports = { firebase_db, firebase_auth };
