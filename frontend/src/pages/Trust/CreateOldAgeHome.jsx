import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../context/TokenContext";
import LocationInput from "../../Authentication/TypeWiseUpload/LocationInput";
import InputField from "../../Authentication/TypeWiseUpload/InputField";
import Navbar from "../../components/Navbar";
const CreateOldAgeHome = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    old_age_home_name: "",
    old_age_home_upi_id: "",
    is_appointment_enabled: false,
    old_age_home_country: "",
    old_age_home_state: "",
    old_age_home_city: "",
    old_age_home_address: "",
    opens_on: "",
    closes_on: "",
    working_days: [],
    contact_numbers: ["", "", ""],
    email: "",
  });

  const [error, setError] = useState("");
  const [locationCodes, setLocationCodes] = useState({
    countryCode: "",
    stateCode: "",
  });
  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleLocationChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update location codes if provided
    if (e.countryCode || e.stateCode) {
      setLocationCodes((prev) => ({
        ...prev,
        ...(e.countryCode && { countryCode: e.countryCode }),
        ...(e.stateCode && { stateCode: e.stateCode }),
      }));
    }
  };

  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };
  const handlePhoneNumberChange = (index, value) => {
    const updatedNumbers = [...formData.contact_numbers];
    updatedNumbers[index] = value;
    setFormData((prev) => ({
      ...prev,
      contact_numbers: updatedNumbers,
    }));
  };
  const addPhoneNumberField = () => {
    setFormData((prev) => ({
      ...prev,
      contact_numbers: [...prev.contact_numbers, ""],
    }));
  };

  const removePhoneNumberField = (index) => {
    setFormData((prev) => ({
      ...prev,
      contact_numbers: prev.contact_numbers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:7001/api/old-age-homes/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/near-me");
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <InputField
              name="old_age_home_name"
              placeholder="Old Age Home Name"
              value={formData.old_age_home_name}
              onChange={handleInputChange}
            />
            <InputField
              name="old_age_home_upi_id"
              placeholder="UPI ID"
              value={formData.old_age_home_upi_id}
              onChange={handleInputChange}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_appointment_enabled"
                checked={formData.is_appointment_enabled}
                onChange={handleInputChange}
                className="rounded"
              />
              <label>Enable Appointments</label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <LocationInput
              type="country"
              name="old_age_home_country"
              value={formData.old_age_home_country}
              onChange={handleLocationChange}
              placeholder="Select Country"
              required
            />

            <LocationInput
              type="state"
              name="old_age_home_state"
              value={formData.old_age_home_state}
              onChange={handleLocationChange}
              codes={{ countryCode: locationCodes.countryCode }}
              placeholder="Select State"
              required
            />

            <LocationInput
              type="city"
              name="old_age_home_city"
              value={formData.old_age_home_city}
              onChange={handleLocationChange}
              codes={{
                countryCode: locationCodes.countryCode,
                stateCode: locationCodes.stateCode,
              }}
              placeholder="Select City"
              required
            />

            <LocationInput
              type="address"
              name="old_age_home_address"
              value={formData.old_age_home_address}
              onChange={handleLocationChange}
              placeholder="Enter Address"
              required
            />
          </div>
        );

      case 3:
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
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.working_days.includes(day)}
                      onChange={() => handleWorkingDaysChange(day)}
                      className="rounded"
                    />
                    <label className="capitalize">{day}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="mb-4">
            <h3>Add Contact Numbers (Up to 3)</h3>
            {formData.contact_numbers.map((number, index) => (
              <div key={index} className="flex items-center space-x-2">
                <InputField
                  type="tel"
                  placeholder={`Contact Number ${index + 1}`}
                  value={number}
                  onChange={(e) =>
                    handlePhoneNumberChange(index, e.target.value)
                  }
                  required={index === 0} // First number is required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePhoneNumberField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {formData.contact_numbers.length < 3 && (
              <button
                type="button"
                onClick={addPhoneNumberField}
                className="text-blue-500"
              >
                Add Another Contact Number
              </button>
            )}
            <InputField
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[#002D74] mb-6">
            Create Old Age Home - Step {step}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-[#002D74] text-white px-4 py-2 rounded-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[#002D74] text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOldAgeHome;
