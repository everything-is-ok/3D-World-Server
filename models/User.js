const mongoose = require("mongoose");
const findOrCreate = require("mongoose-find-or-create");

// TODO: add schema
// TODO: 디폴트 이미지 어쩔지 생각해보기
const defaultPhotoURL = "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257__340.png";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  name: {
    type: String,
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
