const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/pickmeup`);
// const uri = "mongodb+srv://idsh:idaNN1991@cluster0-c0w6a.gcp.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});