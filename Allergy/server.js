const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdata', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create a simple User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  personalData: {
    age: Number,
    weight: Number,
    height: Number,
    gender: String
  },
  contacts: [{
    name: String,
    phone: String
  }]
});

const User = mongoose.model('User', UserSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/user', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send({ message: 'User data saved' });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Server static files
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});