import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);

  // Retrieve token from localStorage
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      alert("You must log in first!");
      navigate("/login");
      return;
    }

    // Fetch user data
    axios
      .get("http://127.0.0.1:8000/api/user/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error("User fetch failed:", error);
        alert("Session expired! Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      });

    // Fetch existing bookings for the property
    axios
      .get(`http://127.0.0.1:8000/api/bookings/?property=${id}`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setExistingBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [navigate, id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("User data not available. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const totalDays =
        (new Date(bookingDetails.checkOut).getTime() - new Date(bookingDetails.checkIn).getTime()) /
        (1000 * 60 * 60 * 24);

      if (totalDays <= 0) {
        setError("Check-out date must be after the check-in date.");
        setLoading(false);
        return;
      }

      const requestData = {
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        total_price: totalDays * 100, // Assuming $100 per night
        status: "pending",
        user: user.id,
        property: id,
      };

      console.log("Booking request:", requestData);

      const response = await axios.post("http://127.0.0.1:8000/api/bookings/", requestData, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 201) {
        setSuccess(true);
        setExistingBookings([...existingBookings, response.data]); // Update displayed bookings
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

      {user && (
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
            <Form.Control
              type="date"
              name="checkIn"
              value={bookingDetails.checkIn}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="checkOut">
            <Form.Label>Check-Out Date</Form.Label>
            <Form.Control
              type="date"
              name="checkOut"
              value={bookingDetails.checkOut}
              onChange={handleChange}
              required
            />
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
      )}

      {/* Display existing bookings for the property */}
      <h3 className="mt-4">Existing Bookings for this Property</h3>
      {existingBookings.length > 0 ? (
        <ul>
          {existingBookings.map((booking) => (
            <li key={booking.id}>
              {booking.check_in_date} to {booking.check_out_date} - {booking.guests} guests
            </li>
          ))}
        </ul>
      ) : (
        <p>No existing bookings for this property.</p>
      )}
    </Container>
  );
};

export default Booking;
