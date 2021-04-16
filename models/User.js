const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

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

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
