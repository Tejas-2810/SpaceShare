const express = require("express");
const multer = require("multer");
const router = express.Router();
const spaceController = require("../controllers/spaceController");
const spaceDashboardController = require("../controllers/spaceDashboardController");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(".").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

 const upload = multer({ storage: storage });

// space Dashboard
router.post(
  "/createspaces",
  upload.fields([
    { name: "photos", maxCount: 5 },
  ]),
spaceController.createSpace
);

// Get paid and free bookings percentage for user's spaces - pie chart
router.get(
  "/bookingpercentages/:userId",
  spaceDashboardController.getBookingPercentagesForUserspaces
);

// Route to get all spaces owned by a specific user
router.get(
  '/ownerspaces/:userId',
  spaceDashboardController.getspacesByOwner
);

// Route to get booking data for each of a user's spaces - line chart 
router.get(
  '/numberOfspacebookings/:userId',
  spaceDashboardController.getspaceBookings
);

// Route to get overall review of all user spaces
router.get(
  '/overall-averagerating/:userId',
  spaceDashboardController.getOverallAverageRatingForUserspaces
);

// Route to get average ratings for each of a user's spaces - bar chart 
router.get(
  '/spaceratings/:userId',
  spaceDashboardController.getUserspacesAverageRating
);

router.get(
  '/total-bookings/:userId',
  spaceDashboardController.getAverageBookingsForUserspaces
);

//Top 3 spaces
router.get("/topspaces", spaceController.getTopSpaces);

//Top 5 spaces by seating capacity
router.get(
  "/topseatingspaces",
  spaceController.getTopSpacesBySeatingCapacity
);

//delete spaces by id
router.delete("/delete/:spaceId", spaceController.deleteSpaceById);

//delete spaces from user data
router.delete("/delete/:userId/:spaceId", spaceDashboardController.deletespaceFromUser);

// Space Page
router.get("/:id", spaceController.getSpaceById);

// Space Reviews
router.get("/:spaceID/reviews", spaceController.getSpaceReviews);

//Home page
router.get("/", spaceController.getAllSpacesForHomePage);

module.exports = router;
