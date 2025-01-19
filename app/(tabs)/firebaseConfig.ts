import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCNKYpJkhtdTuAsBVCWzZ8AmTOsZG0t7ks",
    authDomain: "app-dev-c81aa.firebaseapp.com",
    projectId: "app-dev-c81aa",
    storageBucket: "app-dev-c81aa.firebasestorage.app",
    messagingSenderId: "545938413218",
    appId: "1:545938413218:web:c85c7e4c50c59a312e69fb"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);