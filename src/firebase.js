import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD3ICycjZ_lNX3JXf3TOdZtt1VSCGSNzxA",
  authDomain: "snapchat-83f2c.firebaseapp.com",
  projectId: "snapchat-83f2c",
  storageBucket: "snapchat-83f2c.appspot.com",
  messagingSenderId: "524917382890",
  appId: "1:524917382890:web:61b4e5e9328a095ec7c193",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, provider };
