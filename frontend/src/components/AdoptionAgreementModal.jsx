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

    // Validate PAN (Basic 10 character alphanumeric validation)
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(agreementData.pan)) {
      alert("Please enter a valid PAN number");
      return;
    }

    // Validate Aadhaar (12 digit number)
    if (!/^\d{12}$/.test(agreementData.aadhaar)) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    // Validate DOB (must be past date)
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Adoption Visit Agreement</h2>
        <div className="mb-6 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-semibold mb-2">
            Guidelines for Adoption
          </h3>

          <ul className="list-disc list-inside space-y-2">
            <li>
              All potential adopters must undergo a background verification
              process conducted by the old age home.
            </li>

            <li>
              Adopters should be prepared to provide personal references and
              undergo interviews as part of the verification process.
            </li>

            <li>
              It is essential to demonstrate a genuine commitment to the
              well-being and care of the elderly individual.
            </li>

            <li>
              Adopters must be financially stable and capable of providing for
              the needs of the adopted individual.
            </li>

            <li>
              Regular visits and communication with the old age home are
              encouraged to ensure the well-being of the adopted individual.
            </li>

            <li>
              All legal formalities related to the adoption process must be
              completed as per the regulations of the old age home.
            </li>
          </ul>
        </div>
        <div className="mb-6">
          <p className="whitespace-pre-line">
            {`Agreement for Visiting Old Age Home

This agreement is made on ${today}, between ${username} and White Orchid affiliated Old Age Home.`}
          </p>
          <p className="whitespace-pre-line">{`Requested Appointment is ${appointmentDate} and Time Slot : ${timeSlot}`}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">PAN Number</label>
            <input
              type="text"
              value={agreementData.pan}
              onChange={(e) =>
                setAgreementData({ ...agreementData, pan: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Aadhaar Number</label>
            <input
              type="text"
              value={agreementData.aadhaar}
              onChange={(e) =>
                setAgreementData({ ...agreementData, aadhaar: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              value={agreementData.dob}
              onChange={(e) =>
                setAgreementData({ ...agreementData, dob: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div className="mt-4 space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Accept & Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
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
