import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../Common/Components/Footer";
/* 
@@Image
Create a about folder under the images
the path will be src/assets/images/about
Add the Gif image to the folder you want to show in about us page
Import in given manner once inserted accordingly
*/
// import GIF from "../../assets/images/about/flowers.gif";
const AboutUsAndGallery = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/aboutus`
        );
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.squarespace-cdn.com/content/5f94b6a1a0c1755ee867eefc/1686008313631-VVXOIGKB0P6ND78ZKID6/orcid+in+white+frame+red+max+plus.gif?format=1500w&content-type=image%2Fgif"
                // Step 2 uncomment given line and comment the above line
                // src={GIF}
                alt="About Us Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl">
                About MDBPDB
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white shadow sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-8">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`py-3 px-4 border-b-2 transition-colors duration-300 ${
                    activeTab === "about"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-600 hover:text-blue-500"
                  }`}
                >
                  About Us
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`py-3 px-4 border-b-2 transition-colors duration-300 ${
                    activeTab === "gallery"
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-600 hover:text-blue-500"
                  }`}
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {activeTab === "about" && (
              <div className="max-w-4xl mx-auto">
                {/* About Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-12 overflow-hidden">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                    Our Story
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg overflow-wrap break-word break-all w-full">
                    {content?.description}
                  </p>
                </div>

                {/* Mission & Values */}
                <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                  <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                      Our Mission
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg">
                      To provide exceptional care and support for the elderly,
                      creating a nurturing environment that promotes dignity,
                      independence, and well-being.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                      Our Values
                    </h3>
                    <ul className="text-gray-600 space-y-2 list-disc list-inside">
                      <li>Compassionate Care</li>
                      <li>Respect & Dignity</li>
                      <li>Professional Excellence</li>
                      <li>Community Integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div>
                {/* Images Section */}
                <div className="mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                    Photo Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content?.images.map((image, index) => (
                      <div
                        key={image.fileId}
                        className="group relative overflow-hidden rounded-lg shadow-lg"
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_API_URL
                          }/api/aboutus/files/${image.fileId}`}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button
                            onClick={() =>
                              window.open(
                                `${
                                  import.meta.env.VITE_API_URL
                                }/api/aboutus/files/${image.fileId}`,
                                "_blank"
                              )
                            }
                            className="bg-white text-gray-800 px-4 py-2 rounded-lg transition-transform duration-300"
                          >
                            View Full Size
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Videos Section */}
                {content?.videos && content.videos.length > 0 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
                      Video Gallery
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {content.videos.map((video, index) => (
                        <div
                          key={video.fileId}
                          className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                          <video
                            controls
                            className="w-full"
                            poster={`https://api.deepai.org/job-view-file/0adeb113-276d-42e9-b0ea-cac1041dc74b/outputs/output.jpg`}
                          >
                            <source
                              src={`${
                                import.meta.env.VITE_API_URL
                              }/api/aboutus/files/${video.fileId}`}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Video {index + 1}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default AboutUsAndGallery;
