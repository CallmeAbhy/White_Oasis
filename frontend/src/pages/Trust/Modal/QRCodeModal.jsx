import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ upiId, onClose }) => {
  const upiLink = `upi://pay?pa=${upiId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-2xl transform transition-all">
        <div className="flex flex-col items-center">
          {/* Modal Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Scan to Pay
          </h3>

          {/* QR Code */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <QRCodeSVG value={upiLink} size={256} level="H" />
          </div>

          {/* UPI ID */}
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium text-gray-800">UPI ID:</span> {upiId}
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
