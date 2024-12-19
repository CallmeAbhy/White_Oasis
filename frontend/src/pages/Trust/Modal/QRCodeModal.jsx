import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ upiId, onClose }) => {
  const upiLink = `upi://pay?pa=${upiId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Scan to Pay</h3>

          <QRCodeSVG value={upiLink} size={256} level="H" />

          <p className="mt-4 text-sm text-gray-600">UPI ID: {upiId}</p>

          <button
            onClick={onClose}
            className="mt-4 bg-[#002D74] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

QRCodeModal.propTypes = {
  upiId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QRCodeModal;
