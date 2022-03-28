import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

initializeApp({
  apiKey: "AIzaSyBmEpQ8bG6nsUHI2jbW_LCEgp3lNrhutr8",
  authDomain: "bbd-invoice.firebaseapp.com",
  projectId: "bbd-invoice",
  storageBucket: "bbd-invoice.appspot.com",
  messagingSenderId: "696098333984",
  appId: "1:696098333984:web:d791249762fa130d17a345",
  measurementId: "G-EGV0517QGL"
});

const db = getFirestore();

export default db
