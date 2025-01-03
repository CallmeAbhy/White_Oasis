// src/components/Footer.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const Footer = ({ footerInfo }) => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">White Oasis</h3>
            <p className="text-gray-400 mb-6">{footerInfo.subtitle}</p>
            <div className="flex space-x-4">
              {footerInfo.facebook && (
                <a
                  href={footerInfo.facebook}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </a>
              )}
              {footerInfo.twitter && (
                <a
                  href={footerInfo.twitter}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
              )}
              {footerInfo.instagram && (
                <a
                  href={footerInfo.instagram}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
              )}
              {footerInfo.youtube && (
                <a
                  href={footerInfo.youtube}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faYoutube} size="lg" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/near-me"
                  className="text-gray-400 hover:text-white transition"
                >
                  Find Care Homes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">24/7 Care Support</li>
              <li className="text-gray-400">Medical Assistance</li>
              <li className="text-gray-400">Recreational Activities</li>
              <li className="text-gray-400">Specialized Care Programs</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                {footerInfo.address}
              </li>
              <li className="text-gray-400 flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                {footerInfo.phone}
              </li>
              <li className="text-gray-400 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                {footerInfo.email}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center md:text-left">
          <p className="text-gray-400">
            © {new Date().getFullYear()} White Oasis. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
Footer.propTypes = {
  footerInfo: PropTypes.shape({
    subtitle: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    instagram: PropTypes.string,
    youtube: PropTypes.string,
  }).isRequired,
};
export default Footer;
