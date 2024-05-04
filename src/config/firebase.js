// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrbiRReop-tCQQ_9FKmZVtHht5_mwUpuQ",
  authDomain: "it-sysarch32-store-lumapac.firebaseapp.com",
  projectId: "it-sysarch32-store-lumapac",
  storageBucket: "it-sysarch32-store-lumapac.appspot.com",
  messagingSenderId: "638426323251",
  appId: "1:638426323251:web:1ed690870c3344d59bc646",
  measurementId: "G-392ZXC60KS"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
