const PendingManager = require("../models/pendingManagerModel");
const User = require("../models/userModel");

const getPendingManagers = async (req, res) => {
  try {
    const pendingManagers = await PendingManager.find();
    res.status(200).json(pendingManagers);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const approveManager = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingManager = await PendingManager.findById(id);
    if (!pendingManager)
      return res.status(404).json({ message: "Request not found." });

    const newUser = new User({
      username: pendingManager.username,
      password: pendingManager.password,
      role: "manager",
    });
    await newUser.save();
    await PendingManager.findByIdAndDelete(id); // Remove from pending
    res.status(200).json({ message: "Manager approved and registered." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const rejectManager = async (req, res) => {
  try {
    const { id } = req.params;
    await PendingManager.findByIdAndDelete(id); // Remove from pending
    res.status(200).json({ message: "Manager registration request rejected." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getPendingManagers,
  approveManager,
  rejectManager,
};
