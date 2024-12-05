const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin, User, Manager } = require("../models/userModel");
const { sendConfirmation } = require("../utils/notifications");
const PendingManager = require("../models/pendingManagerModel");

const register = async (req, res) => {
  const { role, username, password, email, phone } = req.body;

  try {
    // Check for duplicate username, email, and phone
    let existingUser;
    switch (role) {
      case "admin":
        existingUser = await Admin.findOne({
          $or: [{ username }, { email }, { phone }],
        });
        break;
      case "user":
        existingUser = await User.findOne({
          $or: [{ username }, { email }, { phone }],
        });
        break;
      case "manager":
        existingUser = await PendingManager.findOne({
          $or: [{ username }, { email }, { phone }],
        });
        break;
      default:
        return res.status(400).send("Invalid role");
    }

    if (existingUser) {
      const duplicateField =
        existingUser.username === username
          ? "Username"
          : existingUser.email === email
          ? "Email"
          : existingUser.phone === phone
          ? "Phone"
          : null;
      return res
        .status(400)
        .json({ message: `${duplicateField} is already taken` });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Common hashing for all cases

    switch (role) {
      case "admin": {
        const newAdmin = new Admin({
          username,
          password: hashedPassword,
          role,
          email,
          phone,
        });
        await newAdmin.save();
        return res
          .status(201)
          .json({ message: `Admin Registered with username ${username}` });
      }

      case "user": {
        if (!req.files?.governmentIdCard || !req.files?.yourPhoto) {
          return res
            .status(400)
            .json({ message: "All required files must be uploaded" });
        }
        const {
          address: userAddress,
          city: userCity,
          governmentIdCard,
          yourPhoto,
        } = req.body;
        const newUser = new User({
          username,
          password: hashedPassword,
          role,
          email,
          phone,
          address: userAddress,
          city: userCity,
          governmentIdCard: req.files.governmentIdCard[0].path,
          yourPhoto: req.files.yourPhoto[0].path,
        });
        await newUser.save();
        return res
          .status(201)
          .json({ message: `User Registered with username ${username}` });
      }

      case "manager": {
        const {
          address: managerAddress,
          city: managerCity,
          governmentIssuedPhotoId,
          proofOfIncome,
          proofOfResidency,
          oldAgeHomePhoto,
          organization_name,
        } = req.body;
        const newPendingManager = new PendingManager({
          username,
          password: hashedPassword,
          email,
          phone,
          address: managerAddress,
          city: managerCity,
          governmentIssuedPhotoId: req.files.governmentIssuedPhotoId[0].path,
          proofOfIncome: req.files.proofOfIncome[0].path,
          proofOfResidency: req.files.proofOfResidency[0].path,
          oldAgeHomePhoto: req.files.oldAgeHomePhoto[0].path,
          organization_name,
        });
        await newPendingManager.save();
        // email, organization_name, username, feedback
        await sendConfirmation(email, organization_name, username);
        return res.status(201).json({
          message: `Manager registration request submitted for ${username}. Awaiting admin approval.`,
        });
      }

      default:
        return res.status(400).send("Invalid role");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for the user in all collections
    let user = await Admin.findOne({ username });
    if (!user) {
      user = await Manager.findOne({ username });
    }
    if (!user) {
      user = await User.findOne({ username });
    }

    // If user is still not found, return an error
    if (!user) {
      return res
        .status(404)
        .json({ message: `User  with username ${username} not found` });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invalid Credentials` });
    }

    // Generate a token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const role = user.role;
    const profile = user;
    console.log(role);
    res.status(200).json({ token, role, profile });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};
module.exports = {
  register,
  login,
};
