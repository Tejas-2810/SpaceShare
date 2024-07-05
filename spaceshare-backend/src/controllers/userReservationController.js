const Reservation = require("../models/reservations");
const Review = require("../models/review");
var mongoose = require("mongoose");
// return true
exports.getReservationHistory = async (req, res) => {
  const userId = req.params.userId;

  try {
    const reservations = await Reservation.find({ userID: userId });
    console.log(reservations);
    if (reservations.length === 0) {
      return res
        .status(200)
        .json({ message: "No reservations found for this user" });
    }
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  const reservationId = req.params.reservationId;

  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postReservationReview = async (req, res) => {
  try {
    const userID = req.params.userId;
    const reservationID = req.params.reservationId;

    const spaceID = req.body.spaceID;
    const rating = req.body.rating;
    let review = req.body.review;
    newReview = await Review.create({
      spaceID,
      reservationID,
      userID,
      rating,
      review,
    });
    res.status(201).json({ message: "Review submitted successfully!!!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReservation = async (req, res) => {
    const { spaceID, reservationDate, reservationTime, noOfGuests, userID } =
    req.body;
  
console.log(spaceID, reservationDate, reservationTime, noOfGuests)

  if (
    !spaceID ||
    !reservationTime ||
    !reservationDate ||
    !noOfGuests ||
    !userID
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  const newReservation = new Reservation({
    spaceID,
    userID,
    reservationDateTime: new Date(`${reservationDate}T${reservationTime}`),
    noOfGuests,
    status: "Active",
  });

  console.log(newReservation)

  try {
    const savedReservation = await newReservation.save();
    res.status(201).json({
      message: "Reservation created successfully",
      data: savedReservation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating reservation: " + error.message });
  }
};
