// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB0DZs9GU_fGDac4BVb2JFcAF1OlPcafxI",
  authDomain: "tugasuas-e6238.firebaseapp.com",
  databaseURL: "https://tugasuas-e6238-default-rtdb.firebaseio.com", 
  projectId: "tugasuas-e6238",
  storageBucket: "tugasuas-e6238.appspot.com",
  messagingSenderId: "766350597924",
  appId: "1:766350597924:web:5b893a1856b8c890611db1",
  measurementId: "G-8NFQWYQBNP"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Export instance Database & Auth
export const db = getDatabase(app);
export const auth = getAuth(app);

// Jika ingin, Anda bisa export default juga
export default app;
