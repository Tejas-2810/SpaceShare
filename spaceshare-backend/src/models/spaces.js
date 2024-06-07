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
  operatingHours: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  features: {
    outdoorSeating: {
      type: Boolean,
      default: false,
    },
    wifiAvailable: {
      type: Boolean,
      default: false,
    },
  },
  photos: [{ type: String }], 
}, {
  collection: "Spaces"
});

const space = mongoose.model("Spaces", spaceSchema);

module.exports = space;
