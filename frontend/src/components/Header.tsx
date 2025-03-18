import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const handleLogout = () => {
    axios.post("http://127.0.0.1:8000/api/logout/", {}, { withCredentials: true })
      .then(() => {
        window.location.href = "/login"; // Redirect after logout
      })
      .catch(error => console.error("Logout failed:", error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">AirNest-Realty</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/listings">Listings</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><button className="btn btn-danger nav-link" onClick={handleLogout}>Log Out</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
