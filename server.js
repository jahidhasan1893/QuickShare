const express = require('express');

const app = express();

const path = require('path');

const PORT =process.env.PORT || 5000;

app.use(express.json());

const connectDB = require('./config/db');

connectDB();



// Template engine

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(express.static('public'));


//Routes

app.use('/api/files', require('./routes/files'));

app.use('/files', require('./routes/show'));

app.use('/files/download', require('./routes/download'))

app.get('/', (req, res)=>{
    res.render('home');
});

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})