//? CONFIG | FIREBASE

//* Requires
const { initializeApp } = require('firebase/app')
const { getFirestore } = require('firebase/firestore/lite')


//* START
const app = initializeApp({
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    databaseURL: process.env.FIREBASE_URL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGE,
    messagingSenderId: process.env.FIREBASE_SENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID
})
//* END

const DB = getFirestore(app)

module.exports = { DB }