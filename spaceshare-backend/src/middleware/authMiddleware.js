const jwt = require("jsonwebtoken");
const User = require("../models/users");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    const now = new Date().getTime() / 1000; 
    if (decoded.exp < now) {
      return res.status(401).json({ message: "Token has expired" });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "The user belonging to this token no longer exists" });
    }
    if (!["user", "space owner"].includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    if(error.message === "jwt expired"){
      return res.status(401).json({ message: "Token has expired" });
    }
    
    return res.status(500).json({ message: "Unable authenticate as processing the token failed" });
  }
};

module.exports = checkAuth;
