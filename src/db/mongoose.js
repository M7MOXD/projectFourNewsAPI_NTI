// require mongoose
const mongoose = require('mongoose');

// connect to db
mongoose.connect(process.env.MONGO_URL);
