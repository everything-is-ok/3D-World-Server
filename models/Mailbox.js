const mongoose = require("mongoose");

// TODO: add schema

const mailboxSchema = new mongoose.Schema({
  mails: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "sender is required."],
      },
      content: {
        type: String,
        required: [true, "content is required."],
      },
      status: {
        type: String,
        enum: ["NEW", "READ"],
        default: "NEW",
      },
      date: { type: Date, default: Date.now },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Mailbox", mailboxSchema);
