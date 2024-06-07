const Reservation = require("../models/reservations");
const Review = require("../models/review");
const User = require("../models/users");
const mongoose = require("mongoose");
// Function to get all spaces owned by a specific user
exports.getspacesByOwner = async (req, res) => {
    try {
      const ownerId = req.params.userId;
      const owner = await User.findById(ownerId).populate('spaces');
      if (!owner) {
        return res.status(200).json({ message: "No spaces for the particular space owner yet" });
      }
      res.json(owner.spaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  exports.getBookingPercentagesForUserspaces = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('spaces');
      if (!user || user.spaces.length === 0) {
        return res.status(200).json({ message: "No spaces for the particular space owner yet" });
      }
  
      const spaceIds = user.spaces.map(space => space._id);
      const reservations = await Reservation.find({ 
        spaceID: { $in: spaceIds } 
      });
  
      const totalReservations = reservations.length;
      const paidBookings = reservations.filter(reservation => reservation.modeOfBooking === 'paid').length;
      const freeBookings = reservations.filter(reservation => reservation.modeOfBooking === 'free').length;
  
      if (totalReservations === 0) {
        return res.status(200).json({ message: "No reservations found for user's spaces" });
      }
  
      const paidBookingPercentage = (paidBookings / totalReservations) * 100;
      const freeBookingPercentage = (freeBookings / totalReservations) * 100;
  
      res.json({
        totalReservations,
        paidBookingPercentage: paidBookingPercentage.toFixed(2) + '%',
        freeBookingPercentage: freeBookingPercentage.toFixed(2) + '%'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


exports.getspaceBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('spaces');

    if (!user || user.spaces.length === 0) {
      return res.status(200).json({ message: "No spaces for the particular space owner yet" });
    }

    const bookingData = await Promise.all(user.spaces.map(async (space) => {
      const bookingCount = await Reservation.countDocuments({ spaceID: space._id });
      return {
        spaceName: space.spaceName,
        numberOfBookings: bookingCount
      };
    }));

    res.json(bookingData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserspacesAverageRating = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('spaces');
  
      if (!user || user.spaces.length === 0) {
        return res.status(200).json({ message: "No spaces for the particular space owner yet" });
      }
  
      const spacesRatings = await Promise.all(user.spaces.map(async (space) => {
        const averageRatingResult = await Review.aggregate([
          { $match: { spaceID: new mongoose.Types.ObjectId(space._id) } },
          { $group: { _id: "$spaceID", averageRating: { $avg: "$rating" } } }
        ]);
  
        // Set default average rating to 0 if there are no ratings
        const averageRating = averageRatingResult.length > 0 && averageRatingResult[0].averageRating
                               ? averageRatingResult[0].averageRating.toFixed(2)
                               : 0;
  
        return {
          spaceName: space.spaceName,
          averageRating: parseFloat(averageRating) // Ensuring the value is a number
        };
      }));
  
      res.json(spacesRatings);
    } catch (error) {
      console.error("Error fetching space ratings:", error);
      res.status(500).json({ message: "Error fetching space ratings" });
    }
  };


exports.getOverallAverageRatingForUserspaces = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('spaces');
  
      if (!user || user.spaces.length === 0) {
        return res.status(200).json({ message: "No spaces for the particular space owner yet" });
      }
  
      let totalAverageRating = 0;
      const spaces = await Promise.all(user.spaces.map(async (space) => {
        const averageRatingResult = await Review.aggregate([
          { $match: { spaceID: new mongoose.Types.ObjectId(space._id) } },
          { $group: { _id: "$spaceID", averageRating: { $avg: "$rating" } } }
        ]);
  
        const averageRating = averageRatingResult.length > 0 && averageRatingResult[0].averageRating
                                 ? averageRatingResult[0].averageRating
                                 : 0;
  
        totalAverageRating += averageRating;
        return averageRating;
      }));
  
      const overallAverageRating = spaces.length > 0
                                   ? (totalAverageRating / spaces.length).toFixed(2)
                                   : 0;
  
      res.json({
        overallAverageRating: parseFloat(overallAverageRating)
      });
    } catch (error) {
      console.error("Error fetching overall average rating:", error);
      res.status(500).json({ message: "Error fetching overall average rating" });
    }
  };

  exports.getAverageBookingsForUserspaces = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('spaces');

        if (!user || user.spaces.length === 0) {
            return res.status(200).json({ message: "No spaces for the particular space owner yet" });
        }

        const bookingCounts = await Promise.all(user.spaces.map(async (space) => {
            return Reservation.countDocuments({ spaceID: space._id });
        }));

        const totalBookings = bookingCounts.reduce((acc, count) => acc + count, 0);

        res.json({
            totalBookings: totalBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deletespaceFromUser = async (req, res) => {
  const { userId, spaceId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove the space ID from the user's spaces array
    user.spaces = user.spaces.filter(id => id.toString() !== spaceId);

    // Save the updated user
    await user.save();

    return res.status(200).json({ success: true, message: "space deleted from user's list" });
  } catch (error) {
    console.error("Failed to delete space from user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


