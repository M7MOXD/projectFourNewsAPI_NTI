// Create Server
// require express
const express = require('express');
const app = express();

// require dotenv
require('dotenv').config();

// require cors
const cors = require('cors');

// require da mongoose
require('./db/mongoose');

// Create port
const port = process.env.PORT;

// Turn JSON to Object
app.use(express.json());

// USE CORS
app.use(cors());

// Routes
// Home Page Route
app.get('/', (req, res) => {
  res.send('Hello');
});

// require Routers
const reporterRouters = require('./routes/reporter');
app.use(reporterRouters);
const articleRouters = require('./routes/article');
app.use(articleRouters);

// run server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
