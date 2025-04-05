const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://craftopia-b79f8-default-rtdb.europe-west1.firebasedatabase.app/", 
});

// Updated to use the correct Firebase Realtime Database reference method
const firebase_db = admin.database();
const firebase_auth = admin.auth();

module.exports = {firebase_db, firebase_auth};
