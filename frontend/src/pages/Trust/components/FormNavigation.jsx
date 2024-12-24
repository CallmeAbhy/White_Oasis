// components/FormNavigation.jsx
import PropTypes from "prop-types";

export const FormNavigation = ({
  step,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between">
      {step > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
        >
          Previous
        </button>
      )}
      {step < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Submit
        </button>
      )}
    </div>
  );
};
FormNavigation.propTypes = {
  step: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
