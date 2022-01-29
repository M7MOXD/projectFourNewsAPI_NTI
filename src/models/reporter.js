// require mongoose
const mongoose = require('mongoose');

// require validator
const validator = require('validator');

// require bcryptjs
const bcrypt = require('bcryptjs');

// require jsonwebtoken
const jwt = require('jsonwebtoken');

// Create Reporter Schema
const reporterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(x) {
        if (!validator.isEmail(x)) {
          throw new Error('invalid email');
        }
      },
    },
    age: {
      type: Number,
      default: 18,
      validate(x) {
        if (x < 18) {
          throw new Error('invalid age');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
    phone: {
      type: String,
      required: true,
      validate(x) {
        if (!validator.isMobilePhone(x, 'ar-EG')) {
          throw new Error('invalid phone number');
        }
      },
    },
  },
  {
    timestamps: {
      currentTime: () => new Date().getTime() + 7200000,
    },
  }
);

// Schema Pre
reporterSchema.pre('save', async function (next) {
  // define this = Reporter
  const reporter = this;
  // isModified("password") to prevent hashing when password isn't changing
  if (reporter.isModified('password')) {
    // bcrypt Reporter Password
    reporter.password = await bcrypt.hash(reporter.password, 8);
  }
  // next();
});

// Login Function
reporterSchema.statics.findByCredentials = async (email, password) => {
  // find reporter by email
  const reporter = await Reporter.findOne({ email });
  if (!reporter) {
    throw new Error('Unable to Login');
  }
  // compare entered password with the hashed one
  const isMatch = await bcrypt.compare(password, reporter.password);
  if (!isMatch) {
    throw new Error('Unable to Login');
  }
  return reporter;
};

// Generate Token
reporterSchema.methods.generateToken = async function () {
  const reporter = this;
  const token = jwt.sign(
    { _id: reporter._id.toString() },
    process.env.JWT_SECRET
  );
  reporter.tokens = reporter.tokens.concat(token);
  await reporter.save();
  return token;
};

// Relations with Task model
reporterSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'reporter',
});

// hide sensitive data --> password - tokens
reporterSchema.methods.toJSON = function () {
  // document
  const reporter = this;
  // convert form document to object
  const reporterObj = reporter.toObject();

  delete reporterObj.password;
  delete reporterObj.tokens;

  return reporterObj;
};

// Create model Reporter
const Reporter = mongoose.model('Reporter', reporterSchema);

// export Reporter
module.exports = Reporter;
