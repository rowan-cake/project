// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5A8nhB56LKjR2Q8m1zrMJ1QaJ_wnJxGc",
  authDomain: "allegryapp.firebaseapp.com",
  databaseURL: "https://allegryapp-default-rtdb.firebaseio.com",
  projectId: "allegryapp",
  storageBucket: "allegryapp.firebasestorage.app",
  messagingSenderId: "1059003796263",
  appId: "1:1059003796263:web:587f23ffe4b15abca57702",
  measurementId: "G-TMY9C34GPQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function writeUserData(userId,name,email){
  const db = getDatabase();
  const refecne = ref(db, 'users/'+userId);
  set(refecne,{
    name: name,
    email: email,
  }); 
}

writeUserData('rowan12','rowan','cakerwoan@gmail.com')
writeUserData('rhees12','rhees','cakerwoan@gmail.com')
console.log('No errors plzzzz')

