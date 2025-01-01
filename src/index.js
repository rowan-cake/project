// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getDatabase, ref, set, push, get } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js';
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
console.log('No errors plzzzz')

//so that the firebase db can work properly
function encodeEmail(email) {
  return email.replace(/[.@]/g, (match) => match === '.' ? '_dot_' : '_at_');
}

function decodeEmail(encodedEmail) {
  return encodedEmail.replace(/,/g, '.'); // Reverse the encoding
}



//Set up the user's account 
function writeUserAcount(userId, password) {
  const encodedEmail = encodeEmail(userId); // Encode email to use as userId
  const db = getDatabase();
  const reference = ref(db, `users/${encodedEmail}/account`); // Use a sub-path for account data
  set(reference, {
    password: password,
  });
}


//Set up the user's data 
function writeUserData(userId, age, weight, height, gender) {
  const encodedEmail = encodeEmail(userId); // Encode email to use as userId
  const db = getDatabase();
  const reference = ref(db, `users/${encodedEmail}/data`); // Use a sub-path for personal data
  set(reference, {
    age: age,
    weight: weight,
    height: height,
    gender: gender,
  });
}

//Set up the user's emergecy contact 
function writeUserContact(userId, contactName, contactPhone) {
  const encodedEmail = encodeEmail(userId); // Encode email to use as userId
  const db = getDatabase();
  const reference = ref(db, `users/${encodedEmail}/contacts`);
  const newContactRef = push(reference); // Push a new contact every time
  set(newContactRef, {
      contactName: contactName,
      contactPhone: contactPhone,
  })
  .then(() => {
      console.log('Contact data written successfully!');
  })
  .catch((error) => {
      console.error('Error writing user contact data:', error);
  });
}

// Log in the user from the database
function login(userId,password){
  const encodedEmail = encodeEmail(userId); // Encode email to use as userId
  const db = getDatabase();
  const userRef = ref(db, `users/${encodedEmail}`);
  async function checkUser() {
    try {
      // Get the snapshot from Firebase
      const snapshot = await get(userRef);  // Wait for the snapshot

      if (snapshot.exists()) {  // Check if the snapshot contains data
        const userData = snapshot.val();  // Get the data from the snapshot
        if (userData.account && userData.account.password === password) {
          console.log('Login successful.');

          // Store the email and redirect
          localStorage.setItem('email', userId);  // Store the original userId (not the encoded one)
          window.location.href = 'alert-page.html'; // Change to your actual contacts page
        } else {
          alert('Invalid password.');
        }
      } else {
        alert('Error: User data does not exist. Please sign up first.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  }

  // Call the async function to check user data
  checkUser();
}




// rhees's stuff

function showLogin() {
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('loginForm').style.display = 'flex';
  document.getElementById('signInForm').style.display = 'none';
}

function showSignup() {
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'flex';
}

// Attach functions to the global scope (MAKES THE BUTTONS WORK)
window.showLogin = showLogin;
window.showSignup = showSignup;

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
      alert('Please enter both email and password.');
      return;
  }
  login(email,password)

});

document.getElementById('signInForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  //fire base DB
  writeUserAcount(email,password)
  //rest not needed maybe
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
  document.getElementById('signInForm').style.display = "none";
  document.getElementById('personalDataSection').style.display = "flex";
});

document.getElementById('personalDataForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const personalData = {
    age: document.getElementById('age').value,
    weight: document.getElementById('weight').value,
    height: document.getElementById('height').value,
    gender: document.getElementById('gender').value
  };

  const email = localStorage.getItem('email');
  const age = document.getElementById('age').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const gender = document.getElementById('gender').value;

  //add to firebase DB
  writeUserData(email,age,weight,height,gender);

  localStorage.setItem('personalData', JSON.stringify(personalData));
  
  document.getElementById('personalDataSection').style.display = "none";
  document.getElementById('contactsSection').style.display = "flex";
});

let contacts = [];
document.getElementById('addContact').addEventListener('click', function(event) {
  event.preventDefault(); // Ensure default behavior is prevented

  // Retrieve input values and trim whitespace
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  // Log the values for debugging
  console.log('Contact Name:', name);
  console.log('Contact Phone:', phone);

  // Validate inputs
  if (!name || !phone) {
      console.error('Name or phone is missing.');
      return; // Stop execution if inputs are invalid
  }

  const email = localStorage.getItem('email');
  if (!email) {
      console.error('Email not found in localStorage.');
      return;
  }

  // Write contact to Firebase and update local array
  writeUserContact(email, name, phone);
  contacts.push({ name, phone }); // Update local array
  localStorage.setItem('contacts', JSON.stringify(contacts)); // Save to localStorage

  // Clear input fields
  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';

  console.log('Contact added successfully:', name, phone);
});



document.getElementById('continueButton').addEventListener('click', async function(event) {
  event.preventDefault();
  
  try {
    const email = localStorage.getItem('email');
    const personalData = JSON.parse(localStorage.getItem('personalData'));
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const userData = {
      email,
      personalData,
      contacts,
      createdAt: new Date().toISOString()
    };
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (response.ok) {
      alert('Account created successfully!');
      window.location.href = 'alert-page.html';
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});


function displayUserData() {
  const email = localStorage.getItem('email');
  const personalData = JSON.parse(localStorage.getItem('personalData'));
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

  const contentHtml = `
    <p><strong>Email:</strong> ${email || 'No email saved.'}</p>
    <p><strong>Age:</strong> ${personalData?.age || 'Not provided'}</p>
    <p><strong>Weight:</strong> ${personalData?.weight || 'Not provided'} kg</p>
    <p><strong>Height:</strong> ${personalData?.height || 'Not provided'} cm</p>
    <p><strong>Gender:</strong> ${personalData?.gender || 'Not provided'}</p>
    <h3>Emergency Contacts:</h3>
    ${contacts.length > 0 
      ? `<ul>${contacts.map(contact => `<li>${contact.name} - ${contact.phone}</li>`).join('')}</ul>`
      : '<p>No contacts saved.</p>'
    }
  `;

  document.getElementById('userDataContent').innerHTML = contentHtml;
}

// document.addEventListener('DOMContentLoaded', displayUserData);






console.log('No errors plzzzz')

