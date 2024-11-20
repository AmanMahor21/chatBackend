var jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const authRoute = async (req, res, next) => {
  try {
    const cookie = await req.cookies.cookie;
    if (!cookie) {
      return res
        .status(401)
        .json({ error: "Unauthorized access : Token not found" });
    }

    const decoded = jwt.verify(cookie, process.env.JSON_KEY);
    if (!decoded) {
      return res.status(409).json({ error: "Unauthorized : Invalid token" });
    }
    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.json({ error: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in route authentication");
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

module.exports = authRoute;
