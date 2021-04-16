const mongoose = require("mongoose");

// TODO: add schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
  },
  photoURL: {
    type: String,
    default: defaultUserImgUrl,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
