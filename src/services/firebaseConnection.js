
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAKUil6GNVw6ZSt7AIhwUSjMYClIkx5PEU",
    authDomain: "notas-4eea0.firebaseapp.com",
    projectId: "notas-4eea0",
    storageBucket: "notas-4eea0.appspot.com",
    messagingSenderId: "458434721671",
    appId: "1:458434721671:web:f24063e3913b16a505c522"
  };
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };