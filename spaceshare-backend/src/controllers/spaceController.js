const Space = require("../models/spaces");
const Review = require("../models/review");
const path = require("path");
const mongoose = require("mongoose");
//const cloudinary = require("../config/cloudinaryConfig");
const User = require("../models/users");

exports.createSpace = async (req, res) => {
  try {
    const { userId, data } = req.body; // Destructure userId and data from req.body
    //console.log(req.body, userId, data)
    //const data  = req.body;

    // Parse the restaurant data
    console.log("IMP",data)
    //const jsonData = JSON.parse(data);
    console.log("IMP DATA",userId, data)
    const jsonData = data
    console.log(data)

    // Upload menu and photos to Cloudinary
    // const uploadMenuPromises = req.files["menu"].map((file) =>
    //   cloudinary.uploader.upload(file.path)
    // );
    // const uploadPhotosPromises = req.files["photos"].map((file) =>
    //   cloudinary.uploader.upload(file.path)
    // );

    // const menuUploadResults = await Promise.all(uploadMenuPromises);
    // const photosUploadResults = await Promise.all(uploadPhotosPromises);
    const spaceData = {
      ...jsonData,
      // menu: menuUploadResults.map((result) => result.secure_url),
      // photos: photosUploadResults.map((result) => result.secure_url),
    };



    const newSpace = await Space.create(spaceData);


    const user = await User.findById(userId);
    //const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.spaces.push(newSpace._id);
    await user.save();

    res.status(201).json({ success: true, data: newSpace });
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSpaceById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSpacesForHomePage = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpaceReviews = async (req, res) => {
  const restaurantID = req.params.restaurantID;

  try {
    const averageRating = await Review.aggregate([
      { $match: { restaurantID: new mongoose.Types.ObjectId(restaurantID) } }, // Use 'new' keyword here
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const reviewCount = await Review.countDocuments({ restaurantID });

    const reviews = await Review.find({ restaurantID })
      .populate({ path: "userID", select: "name" })
      .select("userID review");

    res.status(200).json({
      averageRating:
        averageRating.length > 0 ? averageRating[0].averageRating : 0,
      reviewCount,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    res.status(500).json({ message: "Error fetching restaurant reviews" });
  }
};

exports.getTopSpaces = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    const restaurantsWithRatings = [];

    for (let restaurant of restaurants) {
      const averageRatingResult = await Review.aggregate([
        {
          $match: { restaurantID: new mongoose.Types.ObjectId(restaurant._id) },
        },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]);

      const averageRating =
        averageRatingResult.length > 0
          ? averageRatingResult[0].averageRating
          : 0;

      restaurantsWithRatings.push({
        ...restaurant.toObject(),
        averageRating,
      });
    }
    restaurantsWithRatings.sort((a, b) => b.averageRating - a.averageRating);
    const top3Restaurants = restaurantsWithRatings.slice(0, 3);
    res.status(200).json(top3Restaurants);
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    res.status(500).json({ message: "Error fetching top restaurants" });
  }
};

exports.getTopSeatingSpaces = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    const restaurantsWithRatings = [];

    for (let restaurant of restaurants) {
      const averageRatingResult = await Review.aggregate([
        {
          $match: { restaurantID: new mongoose.Types.ObjectId(restaurant._id) },
        },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]);

      const averageRating =
        averageRatingResult.length > 0
          ? averageRatingResult[0].averageRating
          : 0;

      restaurantsWithRatings.push({
        ...restaurant.toObject(),
        averageRating,
      });
    }
    restaurantsWithRatings.sort((a, b) => b.averageRating - a.averageRating);
    const top3Restaurants = restaurantsWithRatings.slice(0, 3);
    res.status(200).json(top3Restaurants);
  } catch (error) {
    console.error("Error fetching top restaurants:", error);
    res.status(500).json({ message: "Error fetching top restaurants" });
  }
};

exports.getTopSpacesBySeatingCapacity = async (req, res) => {
  try {
    const top5Restaurants = await Restaurant.find()
      .sort({ seatingCapacity: -1 })
      .limit(5);

    res.status(200).json(top5Restaurants);
  } catch (error) {
    console.error("Error fetching top restaurants by seating capacity:", error);
    res
      .status(500)
      .json({ message: "Error fetching top restaurants by seating capacity" });
  }
};

exports.deleteSpaceById = async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    const space = await Space.findById(spaceId);

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    await Space.findByIdAndDelete(spaceId);

    res.status(200).json({ message: "Space deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
