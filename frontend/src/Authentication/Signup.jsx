import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import CommonFields from "./Common/CommonFields";
import { validateEmail, validatePhone } from "../utils/Vallidator";
import ManagerForm from "./RoleWiseFields/ManagerForm";
import UserForm from "./RoleWiseFields/UserForm";

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
    dateOfBirth: "",
    yearOfEstablishment: "",
  });

  const [locationCodes, setLocationCodes] = useState({
    user: { countryCode: "", stateCode: "" },
    manager: { countryCode: "", stateCode: "" },
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  // https://www.blackbox.ai/chat/mcKwvAl
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };
  const handleLocationChange = (e, role) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));

    // Update location codes if provided

    if (e.countryCode || e.stateCode) {
      setLocationCodes((prev) => ({
        ...prev,

        [role]: {
          ...prev[role],

          ...(e.countryCode && { countryCode: e.countryCode }),

          ...(e.stateCode && { stateCode: e.stateCode }),
        },
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleLogin = () => {
    navigate("/login");
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
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
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
        formDataToSend.append(
          "yearOfEstablishment",
          formData.yearOfEstablishment
        );
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
        backgroundImage:
          "url('https://storage.googleapis.com/a1aa/image/6b1a82a1-b6b6-4003-ae6f-815a0e875b31.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 sm:p-8 md:p-10 mx-4 sm:mx-6 lg:mx-8">
        {/* Heading Section */}
        <h2 className="font-bold text-2xl text-[#002D74] text-center">
          Register
        </h2>
        <p className="text-sm mt-2 text-[#002D74] text-center">
          If you are not a member, join us
        </p>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mt-2">{errorMessage}</div>
        )}

        {/* Form Section */}
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          {/* Common Fields */}
          <CommonFields
            formData={formData}
            handleChange={handleChange}
            usernameClass="border border-gray-300 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002D74]"
            passwordClass="border border-gray-300 p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#002D74]"
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
            required
          />

          {/* Phone Input */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
            required
          />

          {/* Role Selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
            required
            aria-label="Select Role"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="manager">Trust</option>
            <option value="admin">Admin</option>
          </select>

          {/* Conditional Form Rendering */}
          {formData.role === "user" && (
            <UserForm
              formData={formData}
              handleLocationChange={handleLocationChange}
              handleFileChange={handleFileChange}
              locationCodes={locationCodes}
              handleChange={handleChange}
            />
          )}

          {formData.role === "manager" && (
            <ManagerForm
              formData={formData}
              handleChange={handleChange}
              handleLocationChange={handleLocationChange}
              locationCodes={locationCodes}
              handleFileChange={handleFileChange}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer Login Section */}
        <div className="mt-4 text-sm flex justify-between items-center text-[#002D74]">
          <p>Already have an account?</p>
          <button
            onClick={handleLogin}
            className="py-2 px-5 bg-white border rounded-xl hover:scale-105 duration-300"
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
