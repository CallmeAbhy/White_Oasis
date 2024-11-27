const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const PendingManager = require("../models/pendingManagerModel");
const sendConfirmation = require("../utils/sendNotifications");
const register = async (req, res) => {
  try {
    const { username, password, role, email, phone } = req.body;
    console.log(req.body);
    if (role === "manager") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newPendingManager = new PendingManager({
        username,
        password: hashedPassword,
        email,
        phone,
      });
      await newPendingManager.save();
      await sendConfirmation(req.body);
      return res.status(201).json({
        message: `Manager registration request submitted for ${username}. Awaiting admin approval.`,
      });
    } else if (role === "admin") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        role,
        email,
        phone,
      });
      await newUser.save();
      return res.status(201).json({
        message: `Admin registered successfully: ${username}`,
      });
    } else {
      console.log(role);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        role,
        email,
        phone,
      });
      console.log(`1newUser is`);
      console.log(res);
      await newUser.save();
      console.log(`2newUser is`);
      console.log(res);
      res
        .status(201)
        .json({ message: `User Registered with username ${username}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Something went Wrong` });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with username ${username} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invallid Credentials` });
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: `Something went Wrong` });
  }
};
module.exports = {
  register,
  login,
};
