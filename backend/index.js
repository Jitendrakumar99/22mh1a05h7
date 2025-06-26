const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const urlRoutes = require('./routes/urlRoutes');

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('URL Shortener Backend Running');
});

mongoose.connect('mongodb://localhost:27017/urlshortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 