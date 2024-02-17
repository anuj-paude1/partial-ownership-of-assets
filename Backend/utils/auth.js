const customError = require("../customError");
const User = require("../models/User");

module.exports = auth = async (req, res, next) => {
  let { username, password } = req.body;
  let user = await User.findOne({ username: username, password: password });
  if (!user) {
    next(new customError(404, "User Doesn't Exist"));
  } else {
    next();
  }
};
