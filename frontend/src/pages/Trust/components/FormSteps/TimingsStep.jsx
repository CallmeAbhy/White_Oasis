import PropTypes from "prop-types";
export const TimingsStep = ({
  formData,
  handleInputChange,
  handleWorkingDaysChange,
}) => {
  const daysOfWeek = [
    { short: "Sun", full: "sunday" },
    { short: "Mon", full: "monday" },
    { short: "Tue", full: "tuesday" },
    { short: "Wed", full: "wednesday" },
    { short: "Thu", full: "thursday" },
    { short: "Fri", full: "friday" },
    { short: "Sat", full: "saturday" },
  ];
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Opening Time</label>
        <input
          type="time"
          name="opens_on"
          value={formData.opens_on}
          onChange={handleInputChange}
          required
          className="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#002D74]"
        />
      </div>
      <div>
        <label className="block font-medium">Closing Time</label>
        <input
          type="time"
          name="closes_on"
          value={formData.closes_on}
          onChange={handleInputChange}
          required
          className="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#002D74]"
        />
      </div>
      <div className="space-y-2">
        <label className="block font-medium">Working Days</label>
        <div className="grid grid-cols-2 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day.full} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="working_days"
                value={day.full}
                checked={formData.working_days.includes(day.full)}
                onChange={() => handleWorkingDaysChange(day.full)}
                className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-gray-600">{day.short}</label>
            </div>
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
