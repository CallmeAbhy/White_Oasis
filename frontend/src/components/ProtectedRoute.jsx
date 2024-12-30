// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useToken } from "../context/TokenContext";
import { useProfile } from "../context/ProfileContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token } = useToken();
  const { profile } = useProfile();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
