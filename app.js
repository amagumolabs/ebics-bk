const express = require('express');
require('dotenv').config();

const initializeRouter = require('./src/route/initialize.route');
const bankLetterRouter = require('./src/route/bankLetter.route');
const ebicsRouter = require('./src/route/ebics.route');
const app = express();
//accept the json data
app.use(express.json());
app.use('/api/ebics/initialize', initializeRouter);
app.use('/api/ebics/bank-letter', bankLetterRouter);
app.use('/api/ebics', ebicsRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello I am from your backend about</h1>');
});

//---------------------------------------------------
app.listen(process.env.PORT, () => {
  console.log(`the port is listening on port ${process.env.PORT}`);
});
