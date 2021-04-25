const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "itemName is required."],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Item", itemSchema);
