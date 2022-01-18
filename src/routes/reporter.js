// require express
const express = require('express');

// require routers from express
const routers = express.Router();

// require Reporter
const Reporter = require('../models/reporter');

// require auth
const auth = require('../middleware/auth');

// Routes
// POST Route "Sign UP"
routers.post('/signup', async (req, res) => {
  try {
    // Create New Reporter Based On data Send from request
    const newReporter = new Reporter(req.body);
    // Generate Token
    const token = await newReporter.generateToken();
    res.send({ newReporter, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// POST Route "Login"
routers.post('/login', async (req, res) => {
  try {
    // finding reporter by Static Function
    const reporter = await Reporter.findByCredentials(
      req.body.email,
      req.body.password
    );
    // Generate Token
    const token = await reporter.generateToken();
    res.send({ reporter, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// GET Route "Profile"
routers.get('/profile', auth, async (req, res) => {
  // receive reporter from auth: req.reporter
  res.send(req.reporter);
});

// DELETE Route "Logout"
routers.delete('/logout', auth, async (req, res) => {
  try {
    // receive token from auth: req.token
    req.reporter.tokens = req.reporter.tokens.filter((el) => {
      return el !== req.token;
    });
    await req.reporter.save();
    res.send('Logout Successfully');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// DELETE Route "Logout All"
routers.delete('/logoutall', auth, async (req, res) => {
  // receive reporter from auth: req.reporter
  try {
    req.reporter.tokens = [];
    await req.reporter.save();
    res.send('Logout From All Devices Successfully');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// PATCH Route "UPDATE Reporter"
routers.patch('/update', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((update) => (req.reporter[update] = req.body[update]));
    await req.reporter.save();
    res.send(req.reporter);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE Route "Delete Reporter"
routers.delete('/delete', auth, async (req, res) => {
  try {
    req.reporter.delete();
    res.send('Reporter Deleted');
  } catch (error) {
    res.status(400).send(error);
  }
});

// export routers
module.exports = routers;
