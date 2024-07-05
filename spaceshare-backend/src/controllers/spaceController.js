const Space = require("../models/spaces");
const Review = require("../models/review");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinaryConfig");
const User = require("../models/users");

exports.createSpace = async (req, res) => {
  try {
    const { userId, data } = req.body; // Destructure userId and data from req.body
 
    // Parse the space data
    const jsonData = JSON.parse(data);
    console.log(jsonData)
 
    // Upload photos to Cloudinary
  
    const uploadPhotosPromises = req.files["photos"].map((file) =>
      cloudinary.uploader.upload(file.path)
    );
 
    const photosUploadResults = await Promise.all(uploadPhotosPromises);
    const spaceData = {
      ...jsonData,
      photos: photosUploadResults.map((result) => result.secure_url),
    };
 
 
 
    const newSpace = await Space.create(spaceData);
 
 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
 
    user.spaces.push(newSpace._id);
    await user.save();
 
    res.status(201).json({ success: true, data: newSpace });
  } catch (error) {
    console.error("Failed to create space:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


exports.getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    res.json(space);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSpacesForHomePage = async (req, res) => {
  try {
    const spaces = await Space.find();
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpaceReviews = async (req, res) => {
  const spaceID = req.params.spaceID;

  try {
    const averageRating = await Review.aggregate([
      { $match: { spaceID: new mongoose.Types.ObjectId(spaceID) } }, 
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    const reviewCount = await Review.countDocuments({ spaceID });

    const reviews = await Review.find({ spaceID })
      .populate({ path: "userID", select: "name" })
      .select("userID review");

    res.status(200).json({
      averageRating:
        averageRating.length > 0 ? averageRating[0].averageRating : 0,
      reviewCount,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching space reviews:", error);
    res.status(500).json({ message: "Error fetching space reviews" });
  }
};

exports.getTopSpaces = async (req, res) => {
  try {
    const spaces = await Space.find();
    const spacesWithRatings = [];

    for (let space of spaces) {
      const averageRatingResult = await Review.aggregate([
        {
          $match: { spaceID: new mongoose.Types.ObjectId(space._id) },
        },
        { $group: { _id: null, averageRating: { $avg: "$rating" } } },
      ]);

      const averageRating =
        averageRatingResult.length > 0
          ? averageRatingResult[0].averageRating
          : 0;

          spacesWithRatings.push({
        ...space.toObject(),
        averageRating,
      });
    }
    spacesWithRatings.sort((a, b) => b.averageRating - a.averageRating);
    const top3Spaces = spacesWithRatings.slice(0, 3);
    res.status(200).json(top3Spaces);
  } catch (error) {
    console.error("Error fetching top spaces:", error);
    res.status(500).json({ message: "Error fetching top spaces" });
  }
};

exports.getTopSpacesBySeatingCapacity = async (req, res) => {
  try {
    const top5Spaces = await Space.find()
      .sort({ seatingCapacity: -1 })
      .limit(5);

    res.status(200).json(top5Spaces);
  } catch (error) {
    console.error("Error fetching top spaces by seating capacity:", error);
    res
      .status(500)
      .json({ message: "Error fetching top spaces by seating capacity" });
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
