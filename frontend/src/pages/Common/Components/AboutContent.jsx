import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { navigateToHome } from "../../../utils/navigationUtils";
import PropTypes from "prop-types";

const AboutContent = ({ token, setMessage, loading, setLoading }) => {
  const [aboutContent, setAboutContent] = useState({
    description: "",
    images: [],
    videos: [],
  });
  const [multipleImages, setMultipleImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const navigate = useNavigate();
  const [isApiAvailable, setIsApiAvailable] = useState(false);

  // Check API availability on component mount

  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/aboutus`
        );

        setIsApiAvailable(response.status === 200);
      } catch (error) {
        console.log("API not available:", error);
        setIsApiAvailable(false);
      }
    };

    checkApiAvailability();
  }, []);

  const handleAboutReset = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/aboutus/reset`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Content reset successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResetConfirmation = () => {
    if (window.confirm("Please Confirm to delete given data")) {
      handleAboutReset();
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check if total images would exceed 5

    if (multipleImages.length + files.length > 5) {
      setMessage("Maximum 5 images allowed");

      return;
    }

    // Create preview URLs for new files

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),

      name: file.name,
    }));

    setMultipleImages((prev) => [...prev, ...files]);

    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check if total videos would exceed 2

    if (videos.length + files.length > 2) {
      setMessage("Maximum 2 videos allowed");

      return;
    }

    // Create preview URLs for new files

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),

      name: file.name,
    }));

    setVideos((prev) => [...prev, ...files]);

    setVideoPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Add functions to remove files

  const removeImage = (index) => {
    // Revoke the URL to prevent memory leaks

    URL.revokeObjectURL(imagePreviews[index].url);

    setMultipleImages((prev) => prev.filter((_, i) => i !== index));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    // Revoke the URL to prevent memory leaks

    URL.revokeObjectURL(videoPreviews[index].url);

    setVideos((prev) => prev.filter((_, i) => i !== index));

    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Clean up URLs when component unmounts

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));

      videoPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews, videoPreviews]);

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      const formData = new FormData();
      // Add multiple images
      formData.append("description", aboutContent.description);
      multipleImages.forEach((image) => {
        formData.append("images", image);
      });
      // Add videos if any
      videos.forEach((video) => {
        formData.append("videos", video);
      });
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/aboutus/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("About content updated successfully!");
      navigateToHome(navigate);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isApiAvailable ? (
        <>
          {" "}
          <div className="text-center">
            <p className="mb-4">
              Existing content found. Would you like to reset it?
            </p>

            <button
              disabled={loading}
              onClick={handleResetConfirmation}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Resetting..." : "Reset Content"}
            </button>
          </div>
        </>
      ) : (
        <>
          <form onSubmit={handleAboutSubmit} className="space-y-6">
            <div>
              {/* Description */}

              <div className="mb-4">
                <label className="block mb-2">
                  Description
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={aboutContent.description}
                  onChange={(e) =>
                    setAboutContent((prev) => ({
                      ...prev,

                      description: e.target.value,
                    }))
                  }
                  className="w-full border p-2 rounded min-h-[200px]"
                  required
                />
              </div>

              {/* Images Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images ({multipleImages.length}/5)
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={multipleImages.length >= 5}
                />

                {/* Image Previews Grid */}

                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Images:
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />

                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {preview.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Videos Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Videos ({videos.length}/2)
                </label>

                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={videos.length >= 2}
                />

                {/* Video Previews List */}

                {videoPreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Uploaded Videos:
                    </h4>

                    <div className="space-y-2">
                      {videoPreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <video className="w-20 h-12 object-cover rounded">
                              <source src={preview.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>

                            <span className="text-sm text-gray-700">
                              {preview.name}
                            </span>
                          </div>

                          <button
                            onClick={() => removeVideo(index)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? "Updating..." : "Update About Content"}
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );
};
AboutContent.propTypes = {
  token: PropTypes.string.isRequired,
  setMessage: PropTypes.func.func,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.func,
};
export default AboutContent;
