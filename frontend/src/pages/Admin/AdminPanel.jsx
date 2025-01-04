// AdminPanel.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useToken } from "../../context/TokenContext";
import Navbar from "../../components/Navbar";
import { navigateToHome } from "../../utils/navigationUtils";
import { useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import ContactForm from "../Common/Components/ContactForm";
import Footer from "../Common/Components/Footer";

const AdminPanel = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState({
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
  });
  const [aboutContent, setAboutContent] = useState({
    description: "",
    images: [],
    videos: [],
  });
  const [multipleImages, setMultipleImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  // Add these helper functions for handling file uploads and previews

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

  let navigate = useNavigate();
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

      await axios.post("http://localhost:7001/api/landing/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Content updated successfully!");
      navigateToHome(navigate);
    } catch (error) {
      setMessage(error.message || "Error updating content");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:7001/api/landing/reset", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  const handleAboutReset = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:7001/api/aboutus/reset", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Content reset successfully!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      const formData = new FormData();
      // Add multiple images
      formData.append("description", aboutContent.description);
      multipleImages.forEach((image, index) => {
        formData.append("images", image);
      });
      // Add videos if any
      videos.forEach((video, index) => {
        formData.append("videos", video);
      });
      await axios.post("http://localhost:7001/api/aboutus/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
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
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b mb-6">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 font-medium ${
                  selected
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              Home Content
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 font-medium ${
                  selected
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              About Us Content
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Home Content */}
            <Tab.Panel>
              <h2 className="text-2xl font-bold mb-4">Update Home Content</h2>
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
                <button
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                  onClick={handleReset}
                >
                  {loading ? "Resetting..." : "Reset Content"}
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
            </Tab.Panel>
            {/* About Us Content */}
            <Tab.Panel>
              <form onSubmit={handleAboutSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    About Us Content
                  </h3>

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
                  <button
                    disabled={loading}
                    onClick={handleAboutReset}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {loading ? "Resetting..." : "Reset Content"}
                  </button>
                </div>
              </form>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
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
      </div>
      <ContactForm />
      <Footer />
    </>
  );
};

export default AdminPanel;
