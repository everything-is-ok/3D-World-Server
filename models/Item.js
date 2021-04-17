const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "itemName is required."],
  },
  actions: {
    type: Array,
    default: [],
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Item", itemSchema);
