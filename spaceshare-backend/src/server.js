require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors");
const mongoose = require("mongoose"); 
const { connectToDatabase } = require("./database/db"); 
//const userRoutes = require("./routes/userRoutes"); 
const authRoutes = require("./routes/authRoutes"); 
// const newsletterRoutes = require("./routes/newsletterRoutes"); 
// const restaurantRoutes = require("./routes/restaurantRoutes"); 
// const paymentRoutes = require("./routes/paymentRoutes");
// const userReservationRoutes = require("./routes/userReservationRoutes");
// const discountRoutes = require("./routes/discountsRoutes");
// const promotionRoutes = require("./routes/promotionRoutes");
// const contactFormRoutes = require("./routes/contactFormRoutes");
// const cookieParser = require("cookie-parser");
// const { ensureUploadsDirectoryExists } = require("./init");
// const checkAuth = require("./middleware/authMiddleware");


// const origin = JSON.parse(process.env.WEB_APP_ORIGIN);
// var corsOptions = {
//   origin: origin,
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

const app = express(); // Create a new express application
const PORT = process.env.PORT || 8080; // Set the port to the environment variable PORT or 3000

//app.use(cors(corsOptions));
app.use(express.json());
//app.use(cookieParser());

//ensureUploadsDirectoryExists();

async function startServer() {
  try {
    await connectToDatabase(); // Connect to the database

    //app.use("/users", checkAuth, userRoutes); // Create a base URL for the user routes
    app.use("/api/auth", authRoutes); // Create a base URL for the auth routes
    //app.use("/api/newsletter", newsletterRoutes); // Create a base URL for the newsletter routes
    //app.use("/api/restaurants", restaurantRoutes); // Create a base URL for the restaurant routes
    // app.use("/api/user-reservation", checkAuth, userReservationRoutes);
    // app.use("/api/payments", checkAuth, paymentRoutes);
    // app.use("/api/discounts", discountRoutes);
    // app.use("/api/promotions", promotionRoutes);
    // app.use("/public/upload", express.static("public/upload"));
    // app.use("/contact", contactFormRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
