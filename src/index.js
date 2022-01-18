// Create Server
// require express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// require da mongoose
require('./db/mongoose');

// Turn JSON to Object
app.use(express.json());

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
