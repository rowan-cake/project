
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// Emergency alert handling without Twilio
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child } = require('firebase/database');
const { getAnalytics, logEvent } = require('firebase/analytics');

const firebaseConfig = {
  apiKey: "AIzaSyCRF_BLO5r7dPe0fOtE1nZt5K0d7lBLRI0",
  authDomain: "allergyapp-1510b.firebaseapp.com",
  projectId: "allergyapp-1510b",
  storageBucket: "allergyapp-1510b.firebasestorage.app",
  messagingSenderId: "201073416805",
  appId: "1:201073416805:web:a270c4f53987dfd576448c",
  measurementId: "G-8LVE8BFNX6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Register new user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = email.replace(/[.#$\[\]]/g, '_');
    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.password === password) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, personalData, contacts } = req.body;
    const userId = email.replace(/[.#$\[\]]/g, '_');
    await set(ref(db, 'users/' + userId), {
      email,
      password,
      personalData,
      contacts,
      createdAt: new Date().toISOString()
    });
    res.json({ message: 'User registered successfully', id: userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'users'));
    const users = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        users.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
// Send emergency notification
app.post('/api/send-emergency', async (req, res) => {
  try {
    const { email } = req.body;
    const userId = email.replace(/[.#$\[\]]/g, '_');
    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const contacts = userData.contacts || [];
      
      // Store emergency alert in Firebase
      const alertRef = ref(db, `alerts/${userId}`);
      await set(alertRef, {
        timestamp: new Date().toISOString(),
        contacts: contacts,
        status: 'active'
      });
      
      res.json({ message: 'Emergency alert stored successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error storing emergency alert:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
