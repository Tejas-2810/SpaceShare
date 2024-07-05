const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
  spaceName: {
    type: String,
    required: true,
  },
  spaceAddress: {
    type: String,
    required: true,
  },
  pricing: {
    type: String,
    required: true,
  },
  spaceType: {
    type: String,
    required: true,
  },
  checkInTime: {
    type: String,
    required: true,
  },
  checkOutTime: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  Capacity: {
    type: Number,
    required: true,
  },
  photos: [{ type: String , default:false}], 
}, {
  collection: "Spaces"
});

const space = mongoose.model("Spaces", spaceSchema);

module.exports = space;
