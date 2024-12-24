import PropTypes from "prop-types";

export const Information = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Total Capacity
          </label>

          <input
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: Number(e.target.value) })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Occupied Seats
          </label>

          <input
            type="number"
            value={formData.occupied_seats}
            onChange={(e) =>
              setFormData({
                ...formData,
                occupied_seats: Number(e.target.value),
              })
            }
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
            value={formData.staff_info.medical_staff}
            onChange={(e) =>
              setFormData({
                ...formData,

                staff_info: {
                  ...formData.staff_info,
                  medical_staff: Number(e.target.value),
                },
              })
            }
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
            value={formData.staff_info.care_workers}
            onChange={(e) =>
              setFormData({
                ...formData,

                staff_info: {
                  ...formData.staff_info,
                  care_workers: Number(e.target.value),
                },
              })
            }
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
            value={formData.fee_structure.monthly}
            onChange={(e) =>
              setFormData({
                ...formData,

                fee_structure: {
                  ...formData.fee_structure,
                  monthly: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Yearly Fee (₹)
          </label>

          <input
            type="number"
            value={formData.fee_structure.yearly}
            onChange={(e) =>
              setFormData({
                ...formData,

                fee_structure: {
                  ...formData.fee_structure,
                  yearly: Number(e.target.value),
                },
              })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
    </div>
  );
};
Information.propTypes = {
  formData: PropTypes.shape({
    capacity: PropTypes.number.isRequired,
    occupied_seats: PropTypes.number.isRequired,
    staff_info: PropTypes.shape({
      medical_staff: PropTypes.number.isRequired,
      care_workers: PropTypes.number.isRequired,
    }).isRequired,
    diet_type: PropTypes.string.isRequired,
    fee_structure: PropTypes.shape({
      monthly: PropTypes.number.isRequired,
      yearly: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
};
