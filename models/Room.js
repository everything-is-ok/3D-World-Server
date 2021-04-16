const mongoose = require('mongoose');

// TODO: add schema

const roomSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'ownerId is required.'],
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Room', roomSchema);
