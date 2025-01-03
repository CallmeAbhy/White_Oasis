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
import { useHome } from "../../../context/HomeContext";

const Footer = () => {
  const homedata = useHome();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">White Oasis</h3>
            <p className="text-gray-400 mb-6">{homedata.subtitle}</p>
            <div className="flex space-x-4">
              {homedata.facebook && (
                <a
                  href={homedata.facebook}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </a>
              )}
              {homedata.twitter && (
                <a
                  href={homedata.twitter}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
              )}
              {homedata.instagram && (
                <a
                  href={homedata.instagram}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition"
                >
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
              )}
              {homedata.youtube && (
                <a
                  href={homedata.youtube}
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
                {homedata.address}
              </li>
              <li className="text-gray-400 flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                {homedata.phone}
              </li>
              <li className="text-gray-400 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                {homedata.email}
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
export default Footer;