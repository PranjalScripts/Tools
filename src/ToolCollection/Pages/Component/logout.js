// src/Logout.js
import useAuth from "../Auth/auth.js";
import { useNavigate } from "react-router-dom"; // useNavigate replaces useHistory in react-router-dom v6

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate(); // useNavigate hook

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // Redirect to login after logout using useNavigate
    } catch (error) {
      console.error("Failed to log out: ", error);
    }
  };
  

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
