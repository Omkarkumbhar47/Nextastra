// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const protect = async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = { _id: decoded.id };
//       next();
//     } catch (err) {
//       console.error("Auth error:", err);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "No token, authorization denied" });
//   }
// };

// module.exports = protect;
