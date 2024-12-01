const PendingManager = require("../models/pendingManagerModel");
const { Manager } = require("../models/userModel");
const { sendRejection, approval } = require("../utils/notifications");
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
    const { id, email, organization_name, username } = req.params;
    const { feedback } = req.body;
    const pendingManager = await PendingManager.findById(id);
    if (!pendingManager)
      return res.status(404).json({ message: "Request not found." });

    const newManager = new Manager({
      username: pendingManager.username,
      password: pendingManager.password,
      role: "manager",
      email: pendingManager.email,
      phone: pendingManager.phone,
      address: pendingManager.address,
      city: pendingManager.city,
      governmentIssuedPhotoId: pendingManager.governmentIssuedPhotoId,
      proofOfIncome: pendingManager.proofOfIncome,
      proofOfResidency: pendingManager.proofOfResidency,
      oldAgeHomePhoto: pendingManager.oldAgeHomePhoto,
      organization_name: pendingManager.organization_name,
    });
    await newManager.save();
    await approval(email, organization_name, username, feedback);
    await PendingManager.findByIdAndDelete(id); // Remove from pending
    res
      .status(200)
      .json({ message: "Manager approved and registered.", feedback });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const rejectManager = async (req, res) => {
  try {
    const { id, email, organization_name, username } = req.params;
    const { feedback } = req.body;
    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required." });
    }
    await rejectManager(email, organization_name, username, feedback);
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
