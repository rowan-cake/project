
// Authentication display functions
function showLogin() {
  // Hide the auth buttons and show only login form
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('loginForm').style.display = 'flex';
  document.getElementById('signInForm').style.display = 'none';
}

function showSignup() {
  // Hide the auth buttons and show only signup form
  document.getElementById('authButtons').style.display = 'none';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'flex';
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    // Attempt to login via API
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      // If login successful, store email and redirect
      localStorage.setItem('email', email);
      window.location.href = 'alert-page.html';
    } else {
      alert('Invalid email or password');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed. Please try again.');
  }
});

// Handle signup form submission
document.getElementById('signInForm').addEventListener('submit', function(event) {
  event.preventDefault();
  // Store user credentials in localStorage
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  localStorage.setItem('email', email);
  localStorage.setItem('password', password);
  // Show personal data section after signup
  document.getElementById('signInForm').style.display = "none";
  document.getElementById('personalDataSection').style.display = "flex";
});

// Handle personal data form submission
document.getElementById('personalDataForm').addEventListener('submit', function(event) {
  event.preventDefault();
  // Collect and store personal data
  const personalData = {
    age: document.getElementById('age').value,
    weight: document.getElementById('weight').value,
    height: document.getElementById('height').value,
    gender: document.getElementById('gender').value
  };
  localStorage.setItem('personalData', JSON.stringify(personalData));
  
  // Show contacts section after personal data
  document.getElementById('personalDataSection').style.display = "none";
  document.getElementById('contactsSection').style.display = "flex";
});

// Initialize contacts array for storing emergency contacts
let contacts = [];

// Handle adding emergency contacts
document.getElementById('addContact').addEventListener('click', function() {
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  
  if (name && phone) {
    // Add contact to array and store in localStorage
    contacts.push({name, phone});
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Clear input fields after adding contact
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
    console.log('Contact added:', name, phone);
  }
});

// Handle registration completion
document.getElementById('continueButton').addEventListener('click', async function(event) {
  event.preventDefault();
  
  try {
    // Collect all user data for registration
    const email = localStorage.getItem('email');
    const personalData = JSON.parse(localStorage.getItem('personalData'));
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    
    const userData = {
      email,
      personalData,
      contacts,
      createdAt: new Date().toISOString()
    };
    
    // Send registration data to API
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

// Function to display user data in the UI
function displayUserData() {
  // Retrieve all stored user data
  const email = localStorage.getItem('email');
  const personalData = JSON.parse(localStorage.getItem('personalData'));
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

  // Create HTML content to display user data
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

  // Update the UI with user data
  document.getElementById('userDataContent').innerHTML = contentHtml;
}

// Initialize display of user data when page loads
document.addEventListener('DOMContentLoaded', displayUserData);
