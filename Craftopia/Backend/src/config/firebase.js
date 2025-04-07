const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://craftopia-b79f8-default-rtdb.europe-west1.firebasedatabase.app/", 
});

const firebase_db = admin.database();
const firebase_auth = admin.auth();

const originalRef = firebase_db.ref;
firebase_db.ref = function() {
  const ref = originalRef.apply(firebase_db, arguments);
  
  const originalTransaction = ref.transaction;
  ref.transaction = function(updateFn, options = {}) {
    return originalTransaction.call(ref, updateFn, options);
  };
  
  return ref;
};

module.exports = { firebase_db, firebase_auth };
