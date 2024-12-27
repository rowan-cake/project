document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var email = document.getElementById('email').value;
    localStorage.setItem('email', email); // Store email
  
    document.getElementById('signInForm').style.display = "none";
    document.getElementById('personalDataSection').style.display = "flex";
  });
// bottm
  document.getElementById('personalDataForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var personalData = {
      age: document.getElementById('age').value,
      weight: document.getElementById('weight').value,
      height: document.getElementById('height').value,
      gender: document.getElementById('gender').value
    };
    localStorage.setItem('personalData', JSON.stringify(personalData)); // Store personal data as a string
  
    document.getElementById('personalDataSection').style.display = "none";
    document.getElementById('contactsSection').style.display = "flex";
  });
  
  // Initialize contacts array from localStorage or start a new one
  var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  
  document.getElementById('addContact').addEventListener('click', function(event) {
    event.preventDefault(); // Adding this to prevent form submission or default button click behavior
  
    var name = document.getElementById('contactName').value;
    var phone = document.getElementById('contactPhone').value;
  
    contacts.push({name: name, phone: phone});
    localStorage.setItem('contacts', JSON.stringify(contacts)); // Update the stored contacts
  
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
  
    console.log('Contact added:', name, phone);
  });
  
  document.getElementById('continueButton').addEventListener('click', function(event) {
    event.preventDefault();
    // Added functionality to navigate to alert-page.html
    window.location.href = 'alert-page.html';
  });
  
  function displayUserData() {
    // Retrieve stored data
    var email = localStorage.getItem('email');
    var personalData = JSON.parse(localStorage.getItem('personalData'));
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  
    // Creating HTML content to display
    var contentHtml = `<p><strong>Email:</strong> ${email || 'No email saved.'}</p>`;
    contentHtml += `<p><strong>Age:</strong> ${personalData?.age || 'Not provided'}</p>`;
    contentHtml += `<p><strong>Weight:</strong> ${personalData?.weight || 'Not provided'} kg</p>`;
    contentHtml += `<p><strong>Height:</strong> ${personalData?.height || 'Not provided'} cm</p>`;
    contentHtml += `<p><strong>Gender:</strong> ${personalData?.gender || 'Not provided'}</p>`;
    contentHtml += `<h3>Emergency Contacts:</h3>`;
    if (contacts.length > 0) {
      contentHtml += '<ul>';
      contacts.forEach(contact => {
        contentHtml += `<li>${contact.name} - ${contact.phone}</li>`;
      });
      contentHtml += '</ul>';
    } else {
      contentHtml += '<p>No contacts saved.</p>';
    }
  
    // Inserting the HTML content into the userDataContent div
    document.getElementById('userDataContent').innerHTML = contentHtml;
  }
  
  // Assuming you want to display user data on page load
  document.addEventListener('DOMContentLoaded', displayUserData);
  