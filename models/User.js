const mongoose = require("mongoose");
const findOrCreate = require("mongoose-find-or-create");

// TODO: add schema
// TODO: 디폴트 이미지 어쩔지 생각해보기
const defaultPhotoURL = "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257__340.png";
const defaultMusicURL = "https://www.youtube.com/watch?v=MzPjJQIQ0-s";

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    unique: true,
    required: [true, "nickname is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  description: {
    type: String,
    default: "자기소개를 작성하세요.",
    maxlength: 80,
  },
  photo: {
    type: String,
    default: defaultPhotoURL,
  },
  music: {
    type: String,
    default: defaultMusicURL,
  },
}, {
  timestamps: true,
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
