
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

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
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

document.getElementById('signInForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
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
  localStorage.setItem('personalData', JSON.stringify(personalData));
  
  document.getElementById('personalDataSection').style.display = "none";
  document.getElementById('contactsSection').style.display = "flex";
});

let contacts = [];

document.getElementById('addContact').addEventListener('click', function() {
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  
  if (name && phone) {
    contacts.push({name, phone});
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
    console.log('Contact added:', name, phone);
  }
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

document.addEventListener('DOMContentLoaded', displayUserData);
