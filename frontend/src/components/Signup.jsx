import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Country, State, City } from "country-state-city";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    city: "",
    country: "",
    state: "",
    governmentIdCard: null,
    userPhoto: null,
    name_of_trust: "",
    trust_document: null,
    financial_statements: null,
    trust_domicile: null,
    trust_logo: null,
    head_office_city: "",
    head_office_country: "",
    head_office_address: "",
    head_office_state: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headOfficeCountrySuggestions, setHeadOfficeCountrySuggestions] =
    useState([]);
  const [headOfficeStateSuggestions, setHeadOfficeStateSuggestions] = useState(
    []
  );
  const [headOfficeCitySuggestions, setHeadOfficeCitySuggestions] = useState(
    []
  );
  const [headOfficeAddressSuggestions, setHeadOfficeAddressSuggestions] =
    useState([]);
  const [selectedHeadOfficeCountryCode, setSelectedHeadOfficeCountryCode] =
    useState("");
  const [selectedHeadOfficeStateCode, setSelectedHeadOfficeStateCode] =
    useState("");

  const navigate = useNavigate();
  // https://www.blackbox.ai/chat/mcKwvAl
  const validateImageFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    return true;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));

    if (name === "address" && value.length > 2) {
      setLoading(true);
      axios
        .get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: value,
            format: "json",
            limit: 5,
          },
        })
        .then((response) => {
          setAddressSuggestions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setAddressSuggestions([]);
    }
    if (name === "head_office_address" && value.length > 2) {
      setLoading(true);
      axios
        .get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: value,
            format: "json",
            limit: 5,
          },
        })
        .then((response) => {
          setHeadOfficeAddressSuggestions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setHeadOfficeAddressSuggestions([]);
    }
    if (name === "country") {
      const filteredCountries = Country.getAllCountries().filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase())
      );

      setCountrySuggestions(filteredCountries);
    }

    if (name === "state") {
      const filteredStates = State.getStatesOfCountry(
        selectedCountryCode
      ).filter((state) =>
        state.name.toLowerCase().includes(value.toLowerCase())
      );

      setStateSuggestions(filteredStates);
    }

    if (name === "city") {
      const filteredCities = City.getCitiesOfState(
        selectedCountryCode,
        selectedStateCode
      ).filter((city) => city.name.toLowerCase().includes(value.toLowerCase()));

      setCitySuggestions(filteredCities);
    }
    if (name === "head_office_country") {
      const filteredHeadOfficeCountries = Country.getAllCountries().filter(
        (country) => country.name.toLowerCase().includes(value.toLowerCase())
      );
      setHeadOfficeCountrySuggestions(filteredHeadOfficeCountries);
    }
    if (name === "head_office_state") {
      const filteredHeadOfficeStates = State.getStatesOfCountry(
        selectedHeadOfficeCountryCode
      ).filter((state) =>
        state.name.toLowerCase().includes(value.toLowerCase())
      );
      setHeadOfficeStateSuggestions(filteredHeadOfficeStates);
    }
    if (name === "head_office_city") {
      const filteredHeadOfficeCities = City.getCitiesOfState(
        selectedHeadOfficeCountryCode,
        selectedHeadOfficeStateCode
      ).filter((city) => city.name.toLowerCase().includes(value.toLowerCase()));
      setHeadOfficeCitySuggestions(filteredHeadOfficeCities);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "userPhoto" || name === "trust_logo") {
      if (!validateImageFile(file)) {
        alert(`${name} must be in JPEG, JPG, or PNG format`);

        e.target.value = ""; // Clear the file input

        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(String(phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert("Please enter a valid phone number (10 digits).");
      return;
    }
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("role", formData.role);

      if (formData.role === "user") {
        formDataToSend.append("address", formData.address);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("country", formData.country);
        formDataToSend.append("governmentIdCard", formData.governmentIdCard);
        formDataToSend.append("userPhoto", formData.userPhoto);
        formDataToSend.append("state", formData.state);
      } else if (formData.role === "manager") {
        formDataToSend.append("name_of_trust", formData.name_of_trust);
        formDataToSend.append(
          "head_office_address",
          formData.head_office_address
        );
        formDataToSend.append("head_office_city", formData.head_office_city);
        formDataToSend.append(
          "head_office_country",
          formData.head_office_country
        );
        formDataToSend.append("head_office_state", formData.head_office_state);
        formDataToSend.append("trust_document", formData.trust_document);
        formDataToSend.append(
          "financial_statements",
          formData.financial_statements
        );
        formDataToSend.append("trust_domicile", formData.trust_domicile);
        formDataToSend.append("trust_logo", formData.trust_logo);
      }

      const response = await axios.post(
        "http://localhost:7001/api/auth/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert(response.data.message);
        navigate("/login");
        return;
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <section
      className="bg-gray-50 min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://storage.googleapis.com/a1aa/image/6b1a82a1-b6b6-4003-ae6f-815a0e875b31.jpeg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 md:p-10 mx-4 sm:mx-6 lg:mx-8">
        <h2 className="font-bold text-2xl text-[#002D74] text-center">
          Register
        </h2>
        <p className="text-xs mt-2 text-[#002D74] text-center">
          If you are not a member, join us
        </p>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className="p-2 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="text-gray-500"
              />
            </button>
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
          />
          <input
            type="tel"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="manager">Trust</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role === "user" && (
            <>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {countrySuggestions.length > 0 && (
                <div className="relative">
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                    {countrySuggestions.map((country) => (
                      <li
                        key={country.isoCode}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,

                            country: country.name,
                          }));
                          setSelectedCountryCode(country.isoCode);
                          setCountrySuggestions([]);
                          setStateSuggestions([]);
                          setCitySuggestions([]);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {country.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {stateSuggestions.length > 0 && (
                <div className="relative">
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                    {stateSuggestions.map((state) => (
                      <li
                        key={state.isoCode}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,

                            state: state.name,
                          }));
                          setSelectedStateCode(state.isoCode); // Store the selected state code

                          setStateSuggestions([]);

                          setCitySuggestions([]); // Clear city suggestions when state changes
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {state.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <div className="relative">
                {citySuggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                    {citySuggestions.map((city) => (
                      <li
                        key={city.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,

                            city: city.name,
                          }));

                          setCitySuggestions([]);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {loading ? (
                <div className="relative">Loading...</div>
              ) : (
                addressSuggestions.length > 0 && (
                  <div className="relative">
                    <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                      {addressSuggestions.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                address: suggestion.display_name,
                              }));
                              setAddressSuggestions([]);
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-200 w-full text-left"
                          >
                            {suggestion.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
              <div className="flex flex-col mt-4">
                <label
                  className="mb-1 relative group"
                  htmlFor="governmentIdCard"
                >
                  Government ID Card
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Upload Any of Following:
                    <br />
                    1) Aadhar Card
                    <br />
                    2) Pan Card
                    <br />
                    3) Election Card
                  </span>
                </label>
                <input
                  type="file"
                  id="governmentIdCard"
                  name="governmentIdCard"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="mb-1 relative group" htmlFor="userPhoto">
                  User Photo
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Must be in one of the following formats [Limit 5MB]:
                    <br />
                    1) JPEG
                    <br />
                    2) JPG
                    <br />
                    3) PNG
                  </span>
                </label>
                <input
                  type="file"
                  id="userPhoto"
                  name="userPhoto"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
            </>
          )}

          {formData.role === "manager" && (
            <>
              <input
                type="text"
                name="name_of_trust"
                placeholder="Trust Name"
                value={formData.name_of_trust}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <input
                type="text"
                name="head_office_country"
                placeholder="Head Office Country"
                value={formData.head_office_country}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {headOfficeCountrySuggestions.length > 0 && (
                <div className="relative">
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                    {headOfficeCountrySuggestions.map((country) => (
                      <li
                        key={country.isoCode}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,

                            head_office_country: country.name,
                          }));
                          setSelectedHeadOfficeCountryCode(country.isoCode);
                          setHeadOfficeCountrySuggestions([]);
                          setHeadOfficeStateSuggestions([]);
                          setHeadOfficeCitySuggestions([]);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {country.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <input
                type="text"
                name="head_office_state"
                placeholder="Head Office State"
                value={formData.head_office_state}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {headOfficeStateSuggestions.length > 0 && (
                <div className="relative">
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                    {headOfficeStateSuggestions.map((state) => (
                      <li
                        key={state.isoCode}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            head_office_state: state.name,
                          }));
                          setSelectedHeadOfficeStateCode(state.isoCode);
                          setHeadOfficeStateSuggestions([]);
                          setHeadOfficeCitySuggestions([]);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {state.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <input
                type="text"
                name="head_office_city"
                placeholder="Head Office City"
                value={formData.head_office_city}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {headOfficeCitySuggestions.length > 0 && (
                <div className="relative">
                  <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                    {headOfficeCitySuggestions.map((city) => (
                      <li
                        key={city.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            head_office_city: city.name,
                          }));
                          setHeadOfficeCitySuggestions([]);
                        }}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {city.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <input
                type="text"
                name="head_office_address"
                placeholder="Head Office Address"
                value={formData.head_office_address}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              {loading ? (
                <div className="relative">Loading...</div>
              ) : (
                headOfficeAddressSuggestions.length > 0 && (
                  <div className="relative">
                    <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto z-10 w-full">
                      {headOfficeAddressSuggestions.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,

                                head_office_address: suggestion.display_name,
                              }));

                              setHeadOfficeAddressSuggestions([]);
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-200 w-full text-left"
                          >
                            {suggestion.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              <div className="flex flex-col mt-4">
                <label className="mb-1 relative group" htmlFor="trust_document">
                  Trust Document
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Must be in one of the following formats [Limit 5MB]:
                    <br />
                    1) Trust Deed
                    <br />
                    2) Certification of Trust
                    <br />
                    3) PAN Card of Trust
                  </span>
                </label>
                <input
                  type="file"
                  id="trust_document"
                  name="trust_document"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label
                  className="mb-1 relative group"
                  htmlFor="financial_statements"
                >
                  Financial Statements
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Must be in one of the following formats [Limit 5MB]:
                    <br />
                    1) ITR Return
                    <br />
                    2) Annual Report
                    <br />
                  </span>
                </label>
                <input
                  type="file"
                  id="financial_statements"
                  name="financial_statements"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="mb-1 relative group" htmlFor="trust_domicile">
                  Trust Domicile
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Must be in one of the following formats [Limit 5MB]:
                    <br />
                    1) State Registration Document
                    <br />
                    2) Property Deeds
                    <br />
                  </span>
                </label>
                <input
                  type="file"
                  id="trust_domicile"
                  name="trust_domicile"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="mb-1 relative group" htmlFor="trust_logo">
                  Trust Logo
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Must be in one of the following formats [Limit 5MB]:
                    <br />
                    1) JPEG
                    <br />
                    2) JPG
                    <br />
                    3) PNG
                  </span>
                </label>
                <input
                  type="file"
                  id="trust_logo"
                  name="trust_logo"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting} // Disable button while submitting
            className={`bg-[#002D74] rounded-xl text-white py-2 mt-4 hover:scale-105 duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
          <p>Already have an account?</p>
          <button
            className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default Signup;
// https://www.blackbox.ai/chat/qBgqExa
