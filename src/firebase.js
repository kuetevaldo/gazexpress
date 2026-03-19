import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-nq4GNZTdBajt7WBsgxo0o7cNgRYiDBU",
  authDomain: "gazexpress-81b81.firebaseapp.com",
  projectId: "gazexpress-81b81",
  storageBucket: "gazexpress-81b81.firebasestorage.app",
  messagingSenderId: "259739585475",
  appId: "1:259739585475:web:b4f6d00f3219c58be74b76"
};

const app = initializeApp(firebaseConfig);

// 👉 THIS LINE IS IMPORTANT
export const db = getFirestore(app);