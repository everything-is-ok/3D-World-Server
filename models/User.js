const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

// TODO: add schema and fix default-photo-url
const defaultPhotoURL = "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257__340.png"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
  },
  photoURL: {
    type: String,
    default: defaultPhotoURL,
  },
}, {
  timestamps: true,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
