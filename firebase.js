// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
//import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA7sS9lHEmcE1X_HeV8nkAtjgvESwy_vcc',
  authDomain: 'trilha-c654c.firebaseapp.com',
  projectId: 'trilha-c654c',
  storageBucket: 'trilha-c654c.firebasestorage.app',
  messagingSenderId: '268328196564',
  appId: '1:268328196564:web:e7faa37787d8b1cf4f1e41',
  measurementId: 'G-W27ETSW96W'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
//const analytics = getAnalytics(app)

// Inicializa o Firestore e o Auth
const db = getFirestore(app)
const auth = getAuth(app)

// Exporta ambos
export { db, auth }
