const express = require('express');
const path = require('path');
const updateStorage = require('./middlewares/updateStorage.js');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect to the database
const connectDB = require('./config/db');
connectDB();

// Template engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// middleware
app.use(updateStorage);

// Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
