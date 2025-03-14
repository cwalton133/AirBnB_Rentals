import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container className="text-center mt-5">
      <h2>Logging Out...</h2>
      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Logout;