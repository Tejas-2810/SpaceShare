const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    spaceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spaces",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", 
      required: true,
    },
    reservationDateTime: {
      type: Date,
      required: true,
    },
    noOfGuests: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Cancel"],
      default: "Active",
    },
    modeOfBooking: {
      type: String,
    },
  },
  { collection: "Reservations" }
);

// Create a new reservation model
const Reservation = mongoose.model("Reservations", reservationSchema);

// Export the reservation model
module.exports = Reservation;
