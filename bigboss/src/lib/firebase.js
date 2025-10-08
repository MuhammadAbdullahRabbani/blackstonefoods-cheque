
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAjATqddnde-KPKC3sHt8ghLh_sJWWVz8",
  authDomain: "bsf-cheque-app.firebaseapp.com",
  projectId: "bsf-cheque-app",
  storageBucket: "bsf-cheque-app.firebasestorage.app",
  messagingSenderId: "549943148915",
  appId: "1:549943148915:web:47f2f7171e8b4a65e50506"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
