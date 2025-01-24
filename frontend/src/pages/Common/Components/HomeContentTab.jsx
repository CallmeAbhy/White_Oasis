import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { navigateToHome } from "../../../utils/navigationUtils";
import PropTypes from "prop-types";
import { useHome } from "../../../context/HomeContext";

const HomeContentTab = ({
  token,
  loading,
  setLoading,
  message,
  setMessage,
}) => {
  const [imageFiles, setImageFiles] = useState({
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
  });
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const navigate = useNavigate();
  const homeData = useHome();
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        if (homeData.heroImages) {
          setIsApiAvailable(true);
        }
      } catch (error) {
        console.error("Error checking API availability:", error);
        setIsApiAvailable(false);
      }
    };
    checkApiAvailability();
  }, [homeData.heroImages]);
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const handleImageChange = (day, file) => {
    setImageFiles((prev) => ({
      ...prev,
      [day]: file,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Validate that all days have images
      const missingDays = daysOfWeek.filter((day) => !imageFiles[day]);
      if (missingDays.length > 0) {
        throw new Error(`Please select images for: ${missingDays.join(", ")}`);
      }

      // Add each image with its corresponding day
      daysOfWeek.forEach((day) => {
        formData.append("heroImages", imageFiles[day]);
      });

      // Add videos if selected
      if (e.target.heroVideoBig.files[0]) {
        formData.append("heroVideoBig", e.target.heroVideoBig.files[0]);
      }
      if (e.target.heroVideoSmall.files[0]) {
        formData.append("heroVideoSmall", e.target.heroVideoSmall.files[0]);
      }

      // Add text content
      formData.append("title", e.target.title.value);
      formData.append("subtitle", e.target.subtitle.value);
      formData.append("email", e.target.email.value);
      formData.append("phone", e.target.phone.value);
      formData.append("address", e.target.address.value);
      formData.append("facebook", e.target.facebook.value);
      formData.append("instagram", e.target.instagram.value);
      formData.append("twitter", e.target.twitter.value);
      formData.append("youtube", e.target.youtube.value);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/landing/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Content updated successfully!");
      navigateToHome(navigate);
    } catch (error) {
      setMessage(error.message || "Error updating content");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/landing/reset`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Content reset successfully!");
      // Clear form data
      setImageFiles({
        sunday: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
      });
    } catch (error) {
      setMessage(error.message || "Error resetting content");
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfirmation = () => {
    if (window.confirm("Please Confirm to delete given data")) {
      handleReset();
    }
  };
  return (
    <>
      {isApiAvailable ? (
        <>
          <div className="text-center">
            <p className="mb-4">
              Existing content found. Would you like to reset it?
            </p>

            <button
              onClick={handleResetConfirmation}
              disabled={loading}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? "Resetting..." : "Reset Content"}
            </button>
          </div>{" "}
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Title</label>
              <input
                type="text"
                name="title"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Address</label>
              <input
                type="text"
                name="address"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Facebook</label>
              <input
                type="text"
                name="facebook"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Instagram</label>
              <input
                type="text"
                name="instagram"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Twitter</label>
              <input
                type="text"
                name="twitter"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Youtube</label>
              <input
                type="text"
                name="youtube"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Daily Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="border p-4 rounded">
                    <label className="block mb-2 capitalize">
                      {day}s Image
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(day, e.target.files[0])
                      }
                      className="w-full border p-2 rounded"
                      required
                    />
                    {imageFiles[day] && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {imageFiles[day].name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Main Video</label>
              <input
                type="file"
                name="heroVideoBig"
                accept="video/*"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Small Video</label>
              <input
                type="file"
                name="heroVideoSmall"
                accept="video/*"
                className="w-full border p-2 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Uploading..." : "Update Content"}
            </button>

            {message && (
              <div
                className={`mt-4 p-3 rounded ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </>
      )}
    </>
  );
};

HomeContentTab.propTypes = {
  token: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  message: PropTypes.string,
  setMessage: PropTypes.func,
};
export default HomeContentTab;
