const PendingManager = require("../models/pendingManagerModel");
const { Manager } = require("../models/userModel");
const { sendRejection, approval } = require("../utils/notifications");
const { Admin } = require("../models/userModel");
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
      head_office_address: pendingManager.head_office_address,
      head_office_city: pendingManager.head_office_city,
      head_office_country: pendingManager.head_office_country,
      head_office_state: pendingManager.head_office_state,
      trust_document: pendingManager.trust_document,
      financial_statements: pendingManager.financial_statements,
      trust_domicile: pendingManager.trust_domicile,
      trust_logo: pendingManager.trust_logo,
      name_of_trust: pendingManager.name_of_trust,
      yearOfEstablishment: pendingManager.yearOfEstablishment,
    });
    await newManager.save();
    await approval(
      pendingManager.email,
      pendingManager.name_of_trust,
      pendingManager.username,
      feedback
    );
    await PendingManager.findByIdAndDelete(id); // Remove from pending
    res
      .status(200)
      .json({ message: "Manager approved and registered.", feedback });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const rejectManager = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await PendingManager.findById(id);
    const { feedback } = req.body;
    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required." });
    }
    await sendRejection(
      user.email,
      user.name_of_trust,
      user.username,
      feedback
    );
    await PendingManager.findByIdAndDelete(id); // Remove from pending
    res.status(200).json({ message: "Manager registration request rejected." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getPendingManagers,
  approveManager,
  rejectManager,
};
