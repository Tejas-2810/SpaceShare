const express = require("express"); 
const router = express.Router(); 
const authController = require("../controllers/authController"); 

router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router; 
