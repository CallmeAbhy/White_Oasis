import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faUtensils,
  faMoneyBill,
  faHospital,
  faFileDownload,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faWhatsapp,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { generateBrochure } from "./hooks/generateBrochure";

const SOCIAL_PLATFORMS = {
  facebook: { icon: faFacebook, name: "Facebook" },
  whatsapp_group: { icon: faWhatsapp, name: "WhatsApp" },
  twitter: { icon: faTwitter, name: "Twitter" },
  instagram: { icon: faInstagram, name: "Instagram" },
  website: { icon: faLink, name: "Website" },
  youtube: { icon: faYoutube, name: "YouTube" },
};

const About = () => {
  const { state: home } = useLocation();
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center bg-gray-100 p-6 rounded-lg shadow-md">
          <img
            src={`http://localhost:7001/api/files/file/${home.manager_id.trust_logo}`}
            alt="Trust Logo"
            className="w-24 h-24 rounded-full shadow-lg mb-4 md:mb-0 md:mr-6"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              {home.old_age_home_name}
            </h1>
            <p className="text-gray-600">
              Managed by{" "}
              <span className="font-medium">
                {home.manager_id.name_of_trust}
              </span>
            </p>
            <p className="text-gray-500">
              Established in{" "}
              <span className="font-medium">
                {home.manager_id.yearOfEstablishment}
              </span>
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {Object.entries(home.social_links).map(([platform, link]) => {
            const { icon, name } = SOCIAL_PLATFORMS[platform] || {};
            return (
              link && (
                <a
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition"
                  title={name}
                >
                  <FontAwesomeIcon icon={icon} size="2x" />
                </a>
              )
            );
          })}
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Contact Information */}
          <InfoCard title="Contact Information">
            <InfoItem
              icon={faPhone}
              label="Phone Numbers"
              content={home.contact_numbers.map((num, idx) => (
                <p key={idx}>{num}</p>
              ))}
            />
            <InfoItem
              icon={faEnvelope}
              label="Email"
              content={<p>{home.email}</p>}
            />
            <InfoItem
              icon={faMapMarkerAlt}
              label="Address"
              content={<p>{home.old_age_home_address}</p>}
            />
          </InfoCard>

          {/* Operating Hours */}
          <InfoCard title="Operating Hours">
            <InfoItem
              icon={faClock}
              label="Timings"
              content={
                <>
                  <p>Opens: {home.opens_on}</p>
                  <p>Closes: {home.closes_on}</p>
                </>
              }
            />
            <div>
              <h3 className="font-medium">Working Days</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {home.working_days.map((day, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </InfoCard>

          {/* Capacity Information */}
          <InfoCard title="Capacity Information">
            <InfoItem
              icon={faUsers}
              content={
                <>
                  <p>Total Capacity: {home.capacity}</p>
                  <p>Occupied Seats: {home.occupied_seats}</p>
                </>
              }
            />
          </InfoCard>

          {/* Staff Information */}
          <InfoCard title="Staff Information">
            <InfoItem
              icon={faHospital}
              content={
                <>
                  <p>Medical Staff: {home.staff_info.medical_staff}</p>
                  <p>Care Workers: {home.staff_info.care_workers}</p>
                </>
              }
            />
          </InfoCard>

          {/* Facilities */}
          <InfoCard title="Facilities">
            <div className="flex flex-wrap gap-2">
              {home.facilities.map((facility, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </InfoCard>

          {/* Services */}
          <InfoCard title="Services">
            <div className="flex flex-wrap gap-2">
              {home.services.map((service, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </InfoCard>

          {/* Fee Structure */}
          <InfoCard title="Fee Structure">
            <InfoItem
              icon={faMoneyBill}
              content={
                <>
                  <p>Monthly Fee: ₹{home.fee_structure.monthly}</p>
                  <p>Yearly Fee: ₹{home.fee_structure.yearly}</p>
                </>
              }
            />
          </InfoCard>

          {/* Diet Information */}
          <InfoCard title="Diet Information">
            <InfoItem
              icon={faUtensils}
              content={<p>Diet Type: {home.diet_type}</p>}
            />
          </InfoCard>
        </div>

        {/* Download Brochure */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => generateBrochure(home)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            <FontAwesomeIcon icon={faFileDownload} className="mr-2" />
            Download Brochure
          </button>
        </div>
      </div>
    </>
  );
};

/* Utility Components */
const InfoCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoItem = ({ icon, label, content }) => (
  <div className="flex items-start gap-3">
    <FontAwesomeIcon icon={icon} className="text-indigo-500 mt-1" />
    <div>
      {label && <h3 className="font-medium">{label}</h3>}
      <div className="text-gray-600">{content}</div>
    </div>
  </div>
);

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
InfoItem.propTypes = {
  icon: PropTypes.object.isRequired,
  label: PropTypes.string,
  content: PropTypes.node.isRequired,
};
export default About;
