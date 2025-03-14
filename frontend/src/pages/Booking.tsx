import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Simulated logged-in user details (replace with actual auth state)
  const [user, setUser] = useState({ name: "John Doe", email: "johndoe@example.com", id: 1 });

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const totalDays =
        (new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) /
        (1000 * 60 * 60 * 24);

      if (totalDays <= 0) {
        setError("Check-out date must be after check-in date.");
        setLoading(false);
        return;
      }

      const requestData = {
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        total_price: totalDays * 100, // Assuming $100 per night
        status: "pending",
        user: user.id, // Replace with actual logged-in user ID
        property: id,
      };

      console.log("Booking request:", requestData);

      const response = await axios.post("http://127.0.0.1:8000/api/bookings/", requestData);

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to book the property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>Booking Property ID: {id}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Booking confirmed! Redirecting...</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={user.name} readOnly />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={user.email} readOnly />
        </Form.Group>

        <Form.Group controlId="checkIn">
          <Form.Label>Check-In Date</Form.Label>
          <Form.Control type="date" name="checkIn" value={bookingDetails.checkIn} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="checkOut">
          <Form.Label>Check-Out Date</Form.Label>
          <Form.Control type="date" name="checkOut" value={bookingDetails.checkOut} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="guests">
          <Form.Label>Number of Guests</Form.Label>
          <Form.Control as="select" name="guests" value={bookingDetails.guests} onChange={handleChange} required>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>
      </Form>
    </Container>
  );
};

export default Booking;
