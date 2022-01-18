// require jsonwebtoken
const jwt = require('jsonwebtoken');

// require Reporter
const Reporter = require('../models/reporter');

// Create Authentication Function
const auth = async (req, res, next) => {
  try {
    // GET token
    const token = req.header('Authorization').replace('Bearer ', '');
    // decode token --> return: _id, iat
    const decode = jwt.verify(token, 'node');
    // GET reporter by _id
    const reporter = await Reporter.findOne({
      _id: decode._id,
      tokens: token,
    });
    if (!reporter) {
      throw new Error();
    }
    // send reporter && token in variables named: "req.reporter" -- "req.token"
    req.token = token;
    req.reporter = reporter;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please Authenticate' });
  }
};

// export auth
module.exports = auth;
