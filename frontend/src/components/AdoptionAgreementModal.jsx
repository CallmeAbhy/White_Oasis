// src/components/AdoptionAgreementModal.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const AdoptionAgreementModal = ({
  isOpen,
  onClose,
  onSubmit,
  username,
  appointmentDate,
  timeSlot,
}) => {
  const [agreementData, setAgreementData] = useState({
    pan: "",
    aadhaar: "",
    dob: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(agreementData.pan)) {
      alert("Please enter a valid PAN number");
      return;
    }

    if (!/^\d{12}$/.test(agreementData.aadhaar)) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    const dobDate = new Date(agreementData.dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();
    if (dobDate >= today) {
      alert("Please enter a valid date of birth");
      return;
    }
    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < dobDate.getDate())
    ) {
      alert("You must be at least 18 years old");
      return;
    }

    onSubmit(agreementData);
  };

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Adoption Visit Agreement
        </h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Adoption Guidelines
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
            <li>Background verification required by the old age home</li>
            <li>Provide personal references and attend interviews</li>
            <li>Demonstrate genuine commitment to elderly care</li>
            <li>Financial stability to support adopted individual</li>
            <li>Regular visits and communication encouraged</li>
            <li>Complete all legal formalities per regulations</li>
          </ul>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-gray-700 text-sm whitespace-pre-line">
            Agreement for Visiting Old Age Home
            <br />
            Dated: {today}
            <br />
            Between: {username} and MDBPDB Old Age Home
          </p>
          <p className="text-gray-700 text-sm font-medium bg-indigo-50 p-2 rounded-md">
            Appointment: {appointmentDate} | Time: {timeSlot}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              PAN Number
            </label>
            <input
              type="text"
              value={agreementData.pan}
              onChange={(e) =>
                setAgreementData({
                  ...agreementData,
                  pan: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="ABCDE1234F"
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Aadhaar Number
            </label>
            <input
              type="text"
              value={agreementData.aadhaar}
              onChange={(e) =>
                setAgreementData({ ...agreementData, aadhaar: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              placeholder="123456789012"
              maxLength={12}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value={agreementData.dob}
              onChange={(e) =>
                setAgreementData({ ...agreementData, dob: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              Accept & Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AdoptionAgreementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  appointmentDate: PropTypes.string.isRequired,
  timeSlot: PropTypes.string.isRequired,
};

export default AdoptionAgreementModal;
