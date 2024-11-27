import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Navbar({ user }) {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    if (user.role === "admin") {
      navigate("/api/users/admin");
    } else if (user.role === "manager") {
      navigate("/api/users/manager");
    } else {
      navigate("/api/users/user");
    }
  };
  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <button onClick={handleProfileClick}>Profile</button>
          <button>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
