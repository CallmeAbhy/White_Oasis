import PropTypes from "prop-types";

export const Information = ({ formData, setFormData }) => {
  const handleNumberChange =
    (field, nestedField = null) =>
    (e) => {
      const value = e.target.value === "" ? "" : Number(e.target.value);
      if (nestedField) {
        setFormData({
          ...formData,
          [field]: {
            ...formData[field],
            [nestedField]: value,
          },
        });
      } else {
        setFormData({
          ...formData,
          [field]: value,
        });
      }
    };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Total Capacity
          </label>

          <input
            type="number"
            value={formData.capacity === "" ? "" : formData.capacity}
            onChange={handleNumberChange("capacity")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Occupied Seats
          </label>

          <input
            type="number"
            value={
              formData.occupied_seats === "" ? "" : formData.occupied_seats
            }
            onChange={handleNumberChange("occupied_seats")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Medical Staff Count
          </label>

          <input
            type="number"
            value={
              formData.staff_info.medical_staff === ""
                ? ""
                : formData.staff_info.medical_staff
            }
            onChange={handleNumberChange("staff_info", "medical_staff")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Care Workers Count
          </label>

          <input
            type="number"
            value={
              formData.staff_info.care_workers === ""
                ? ""
                : formData.staff_info.care_workers
            }
            onChange={handleNumberChange("staff_info", "care_workers")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Diet Type
        </label>

        <select
          value={formData.diet_type}
          onChange={(e) =>
            setFormData({ ...formData, diet_type: e.target.value })
          }
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Diet Type</option>

          <option value="Veg">Vegetarian</option>

          <option value="Non-Veg">Non-Vegetarian</option>

          <option value="Both">Both</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Monthly Fee (₹)
          </label>

          <input
            type="number"
            value={
              formData.fee_structure.monthly === ""
                ? ""
                : formData.fee_structure.monthly
            }
            onChange={handleNumberChange("fee_structure", "monthly")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Yearly Fee (₹)
          </label>

          <input
            type="number"
            value={
              formData.fee_structure.yearly === ""
                ? ""
                : formData.fee_structure.yearly
            }
            onChange={handleNumberChange("fee_structure", "yearly")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="0"
            required
          />
        </div>
      </div>
    </div>
  );
};
Information.propTypes = {
  formData: PropTypes.shape({
    capacity: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    occupied_seats: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    staff_info: PropTypes.shape({
      medical_staff: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      care_workers: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    }).isRequired,
    diet_type: PropTypes.string.isRequired,
    fee_structure: PropTypes.shape({
      monthly: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      yearly: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    }).isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
};
