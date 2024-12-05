import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    city: "",
    governmentIdCard: null,
    yourPhoto: null,
    organization_name: "",
    governmentIssuedPhotoId: null,
    proofOfIncome: null,
    proofOfResidency: null,
    oldAgeHomePhoto: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  // const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
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

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert("Please enter a valid phone number (10 digits).");
      return;
    }

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
        formDataToSend.append("governmentIdCard", formData.governmentIdCard);
        formDataToSend.append("yourPhoto", formData.yourPhoto);
      } else if (formData.role === "manager") {
        formDataToSend.append("organization_name", formData.organization_name);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("city", formData.city);
        formDataToSend.append(
          "governmentIssuedPhotoId",
          formData.governmentIssuedPhotoId
        );
        formDataToSend.append("proofOfIncome", formData.proofOfIncome);
        formDataToSend.append("proofOfResidency", formData.proofOfResidency);
        formDataToSend.append("oldAgeHomePhoto", formData.oldAgeHomePhoto);
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
        // if (formData.role === "manager") {
        navigate("/login");
        return;
        // }

        // const loginResponse = await axios.post(
        //   "http://localhost:7001/api/auth/login",
        //   {
        //     username: formData.username,
        //     password: formData.password,
        //   }
        // );

        // setUser({ token: loginResponse.data.token, role: formData.role });
        // localStorage.setItem("token", loginResponse.data.token);
        // navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
            <option value="user">User </option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          {formData.role === "user" && (
            <>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />

              <div className="flex flex-col mt-4">
                <label className="mb-1" htmlFor="governmentIdCard">
                  Government ID Card
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
                <label className="mb-1" htmlFor="yourPhoto">
                  Your Photo
                </label>
                <input
                  type="file"
                  id="yourPhoto"
                  name="yourPhoto"
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
                name="organization_name"
                placeholder="Organization Name"
                value={formData.organization_name}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <div className="flex flex-col mt-4">
                <label className="mb-1" htmlFor="governmentIssuedPhotoId">
                  Goverment Issued Photo ID Card
                </label>
                <input
                  type="file"
                  id="governmentIssuedPhotoId"
                  name="governmentIssuedPhotoId"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="mb-1" htmlFor="proofOfIncome">
                  Proof of Income
                </label>
                <input
                  type="file"
                  id="proofOfIncome"
                  name="proofOfIncome"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="mb-1" htmlFor="proofOfResidency">
                  Proof of Residency
                </label>
                <input
                  type="file"
                  id="proofOfResidency"
                  name="proofOfResidency"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex flex-col mt-4">
                <label className="mb-1" htmlFor="oldAgeHomePhoto">
                  Old Age Home Photo
                </label>
                <input
                  type="file"
                  id="oldAgeHomePhoto"
                  name="oldAgeHomePhoto"
                  onChange={handleFileChange}
                  required
                  className="p-2 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>
            </>
          )}
          {/* {formData.role === "user" && (
            <>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <input
                type="file"
                name="governmentIdCard"
                onChange={handleFileChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none"
              />
              <input
                type="file"
                name="yourPhoto"
                onChange={handleFileChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none"
              />
            </>
          )}
          {formData.role === "manager" && (
            <>
              <input
                type="text"
                name="organization_name"
                placeholder="Organization Name"
                value={formData.organization_name}
                onChange={handleChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              />
              <input
                type="file"
                name="proofOfIncome"
                onChange={handleFileChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none"
              />
              <input
                type="file"
                name="proofOfResidency"
                onChange={handleFileChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none"
              />
              <input
                type="file"
                name="oldAgeHomePhoto"
                onChange={handleFileChange}
                required
                className="p-2 mt-4 rounded-xl border border-gray-300 focus:outline-none"
              />
            </>
          )} */}
          <button
            type="submit"
            className="bg-[#002D74] rounded-xl text-white py-2 mt-4 hover:scale-105 duration-300"
          >
            Register
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
