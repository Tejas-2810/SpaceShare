const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://vn769140:0qnmmHBONbLzrAY0@spaceshare-db.7mcxeom.mongodb.net/SpaceShare"
      
    );
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
  }
}

module.exports = { connectToDatabase };
