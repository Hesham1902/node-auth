const jwt = require("jsonwebtoken");
const User = require("../models/User");
//protected routes
let decodedUserId = null;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "hesham maher secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      }
      decodedUserId = decodedToken.id
      // console.log(decodedToken);
      next();
    });
  } else {
    res.redirect("/login");
  }
};
// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, "hesham maher secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      }
      // console.log(decodedToken);
      // Store the decoded user ID in the outer variable
      decodedUserId = decodedToken.id;
      let user = await User.findById(decodedToken.id);
      res.locals.user = user;
      req.userId = decodedToken.id; // Set userId property on the request
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
};
const getId = () => {
  console.log(decodedUserId)
  return decodedUserId; 
}

module.exports = { requireAuth, checkUser, getId };
