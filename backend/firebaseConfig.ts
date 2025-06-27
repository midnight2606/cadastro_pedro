import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCawQOPE4MXx5I-XXwFcYHNjsPB58XhQu8",
  authDomain: "cadastroprodutos-5f2dd.firebaseapp.com",
  projectId: "cadastroprodutos-5f2dd",
  storageBucket: "cadastroprodutos-5f2dd.firebasestorage.app",
  messagingSenderId: "131837635643",
  appId: "1:131837635643:web:426b117be15fd40dda001e",
  measurementId: "G-MRYYZYYF8N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log(app);

export { db };
