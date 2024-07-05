require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors");
const mongoose = require("mongoose"); 
const { connectToDatabase } = require("./database/db"); 
const authRoutes = require("./routes/authRoutes"); 
const spaceRoutes = require("./routes/spaceRoutes"); 
const userReservationRoutes = require("./routes/userReservationRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");
const cookieParser = require("cookie-parser");
const { ensureUploadsDirectoryExists } = require("./init");
const checkAuth = require("./middleware/authMiddleware");


const origin = JSON.parse(process.env.WEB_APP_ORIGIN);
var corsOptions = {
  origin: origin,
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express(); // Create a new express application
const PORT = process.env.PORT || 8080; // Set the port to the environment variable PORT or 3000

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

ensureUploadsDirectoryExists();

async function startServer() {
  try {
    await connectToDatabase(); 

    app.use("/api/auth", authRoutes); 
    app.use("/api/spaces", spaceRoutes); 
    app.use("/api/user-reservation", checkAuth, userReservationRoutes);
    app.use("/public/upload", express.static("public/upload"));
    app.use("/contact", contactFormRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
