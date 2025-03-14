// BookingForm.tsx
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({ checkin: "", checkout: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/api/bookings/", formData)
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  };
  return (
    <Container>
      <h2>Book a Property</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Check-in</Form.Label>
          <Form.Control type="date" name="checkin" value={formData.checkin} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Check-out</Form.Label>
          <Form.Control type="date" name="checkout" value={formData.checkout} onChange={handleChange} />
        </Form.Group>
        <Button type="submit" className="mt-2">Book Now</Button>
      </Form>
    </Container>
  );
};

export default BookingForm;
