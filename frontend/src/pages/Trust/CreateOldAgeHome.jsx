import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../context/TokenContext";
import LocationInput from "../../Authentication/TypeWiseUpload/LocationInput";
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
    contact_numbers: [""],
    email: "",
    social_links: {
      facebook: "",
      instagram: "",
      twitter: "",
      website: "",
      whatsapp_group: "",
      youtube: "",
    },
    capacity: "",
    occupied_seats: 0,
    facilities: [],
    services: [],
    staff_info: {
      medical_staff: 0,
      care_workers: 0,
    },
    diet_type: "",
    fee_structure: {
      monthly: "",
      yearly: "",
    },
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
  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
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
            {/* Name Input */}
            <div>
              <label
                htmlFor="old_age_home_name"
                className="block text-sm font-medium text-gray-600"
              >
                Old Age Home Name
              </label>
              <input
                type="text"
                id="old_age_home_name"
                name="old_age_home_name"
                value={formData.old_age_home_name}
                onChange={handleInputChange}
                placeholder="Enter old age home name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* UPI ID Input */}
            <div>
              <label
                htmlFor="old_age_home_upi_id"
                className="block text-sm font-medium text-gray-600"
              >
                UPI ID
              </label>
              <input
                type="text"
                id="old_age_home_upi_id"
                name="old_age_home_upi_id"
                value={formData.old_age_home_upi_id}
                onChange={handleInputChange}
                placeholder="Enter UPI ID"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Appointment Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_appointment_enabled"
                name="is_appointment_enabled"
                checked={formData.is_appointment_enabled}
                onChange={handleInputChange}
                className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="is_appointment_enabled" className="text-gray-600">
                Enable Appointments
              </label>
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
              divclassname="relative w-full"
              inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
              loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
              buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
              required
            />

            <LocationInput
              type="state"
              name="old_age_home_state"
              value={formData.old_age_home_state}
              onChange={handleLocationChange}
              codes={{ countryCode: locationCodes.countryCode }}
              placeholder="Select State"
              divclassname="relative w-full"
              inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
              loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
              buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
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
              divclassname="relative w-full"
              inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
              loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
              buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
              required
            />

            <LocationInput
              type="address"
              name="old_age_home_address"
              value={formData.old_age_home_address}
              onChange={handleLocationChange}
              placeholder="Enter Address"
              divclassname="relative w-full"
              inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
              loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
              buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
              ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
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
                      className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="capitalize text-gray-600">{day}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-600">
              Add Contact Numbers (Up to 3)
            </h3>
            {formData.contact_numbers.map((number, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="tel"
                  id={`contact_number_${index}`}
                  name={`contact_number_${index}`}
                  value={number}
                  onChange={(e) =>
                    handlePhoneNumberChange(index, e.target.value)
                  }
                  placeholder={`Contact Number ${index + 1}`}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required={index === 0}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePhoneNumberField(index)}
                    className="text-red-500 hover:underline"
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
                className="text-blue-500 hover:underline"
              >
                Add Another Contact Number
              </button>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media Links</h3>
              {Object.keys(formData.social_links).map((platform) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-600 capitalize">
                    {platform.replace("_", " ")}
                  </label>

                  <input
                    type="url"
                    name={platform}
                    value={formData.social_links[platform]}
                    onChange={handleSocialLinksChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    placeholder={`Enter ${platform} URL`}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Total Capacity
                </label>

                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
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
                    setFormData({ ...formData, occupied_seats: e.target.value })
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
                        medical_staff: e.target.value,
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
                        care_workers: e.target.value,
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
                        monthly: e.target.value,
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
                        yearly: e.target.value,
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:max-w-md lg:max-w-lg transition-all">
          <h1 className="text-2xl font-semibold text-center text-[#002D74] tracking-wide mb-6">
            Create Old Age Home - Step {step}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            {/* Step Navigation */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Submit
                </button>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOldAgeHome;
