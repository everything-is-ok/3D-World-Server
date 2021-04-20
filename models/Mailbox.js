const mongoose = require("mongoose");

// TODO: add schema

const mailboxSchema = new mongoose.Schema({
  mails: [
    {
      type: new mongoose.Schema(
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
        },
        {
          timestamps: true,
        },
      ),
    },
    {
      timestamps: true,
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Mailbox", mailboxSchema);
