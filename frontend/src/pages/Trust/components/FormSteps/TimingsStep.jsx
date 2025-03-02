import PropTypes from "prop-types";

export const TimingsStep = ({
  formData,
  handleInputChange,
  handleWorkingDaysChange,
}) => {
  const daysOfWeek = [
    { id: "sunday", label: "Sun" },
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
  ];

  return (
    <div className="space-y-6">
      {/* Time Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Opening Time
          </label>
          <input
            type="time"
            name="opens_on"
            value={formData.opens_on}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Closing Time
          </label>
          <input
            type="time"
            name="closes_on"
            value={formData.closes_on}
            onChange={handleInputChange}
            required
            className="w-full p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Working Days Selection */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Working Days
        </label>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => handleWorkingDaysChange(day.id)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                formData.working_days.includes(day.id)
                  ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              aria-pressed={formData.working_days.includes(day.id)}
              title={`Toggle ${day.id}`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

TimingsStep.propTypes = {
  formData: PropTypes.shape({
    opens_on: PropTypes.string.isRequired,
    closes_on: PropTypes.string.isRequired,
    working_days: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleWorkingDaysChange: PropTypes.func.isRequired,
};
