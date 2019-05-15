require("express-async-errors");
const config = require("config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const winston = require("winston");
require('winston-mongodb');
const inventory = require("./routes/inventoryItems");
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
app.use(express.json());

// winston.add({winston.transports.File, filename: 'logFile.log'});
winston.configure({transports: [new winston.transports.File({ filename: 'logfile.log' }) ]});
winston.configure({transports: [new winston.transports.MongoDB({db: 'mongodb://localhost/inventoryManagement'})]});


process.on('uncaughtException', (ex) => {
  // console.error("uncaught exception occured");
  winston.error(ex.message, ex);
});

if(!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
mongoose.connect('mongodb://localhost/inventoryManagement', { 
        useNewUrlParser: true, 
        useFindAndModify: false,
        useCreateIndex: true 
    })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use('/api/inventory', inventory);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3005
app.listen(port, () => console.log(`node server listening on ${port}`));