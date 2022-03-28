import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBmEpQ8bG6nsUHI2jbW_LCEgp3lNrhutr8",
  authDomain: "bbd-invoice.firebaseapp.com",
  projectId: "bbd-invoice",
  storageBucket: "bbd-invoice.appspot.com",
  messagingSenderId: "696098333984",
  appId: "1:696098333984:web:d791249762fa130d17a345",
  measurementId: "G-EGV0517QGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export default app

