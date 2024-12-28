
document.getElementById('signInForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('email', email);
      document.getElementById('signInForm').style.display = "none";
      document.getElementById('personalDataSection').style.display = "flex";
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

document.getElementById('personalDataForm').addEventListener('submit', async function(event) {
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

document.getElementById('addContact').addEventListener('click', function(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const phone = document.getElementById('contactPhone').value;
  
  contacts.push({name, phone});
  localStorage.setItem('contacts', JSON.stringify(contacts));
  
  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';
});

document.getElementById('continueButton').addEventListener('click', async function(event) {
  event.preventDefault();
  
  try {
    const userData = {
      email: localStorage.getItem('email'),
      password: document.getElementById('password').value,
      personalData: JSON.parse(localStorage.getItem('personalData')),
      contacts: JSON.parse(localStorage.getItem('contacts'))
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
      alert('Account created successfully! Redirecting to emergency alert page...');
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
