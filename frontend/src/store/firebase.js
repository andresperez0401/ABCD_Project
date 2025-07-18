import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9RCpXaGNn5fzWAx7SzXCMJZZu4fjEEg4",
  authDomain: "abcdatabase.firebaseapp.com",
  projectId: "abcdatabase",
  storageBucket: "abcdatabase.firebasestorage.app",
  messagingSenderId: "57567413745",
  appId: "1:57567413745:web:1038897a252d0702d33050",
  measurementId: "G-57LPNW2VK1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };