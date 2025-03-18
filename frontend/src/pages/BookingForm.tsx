import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ checkin: "", checkout: "" });
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

    // Fetch existing bookings
    axios
      .get("http://127.0.0.1:8000/api/bookings/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setExistingBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [navigate, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    const totalDays =
      (new Date(formData.checkout).getTime() - new Date(formData.checkin).getTime()) /
      (1000 * 60 * 60 * 24);

    if (totalDays <= 0) {
      setError("Check-out date must be after the check-in date.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings/",
        { check_in_date: formData.checkin, check_out_date: formData.checkout },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 201) {
        console.log("Booking successful:", response.data);
        setSuccess(true);
        setExistingBookings([...existingBookings, response.data]); // Update booking list
        setFormData({ checkin: "", checkout: "" }); // Reset form
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
      <h2>Book a Property</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Booking confirmed!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Check-in</Form.Label>
          <Form.Control
            type="date"
            name="checkin"
            value={formData.checkin}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Check-out</Form.Label>
          <Form.Control
            type="date"
            name="checkout"
            value={formData.checkout}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </Button>
      </Form>

      {/* Display existing bookings */}
      <h3 className="mt-4">Your Existing Bookings</h3>
      {existingBookings.length > 0 ? (
        <ul>
          {existingBookings.map((booking) => (
            <li key={booking.id}>
              {booking.check_in_date} to {booking.check_out_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No existing bookings found.</p>
      )}
    </Container>
  );
};

export default BookingForm;
