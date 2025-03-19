import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getCsrfToken } from "../api/csrf"; // Import CSRF token getter

const PaymentMethodDropdown: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label>Select Payment Method:</label>
      <select className="form-control" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">-- Choose Payment Method --</option>
        <option value="paypal">PayPal</option>
        <option value="credit_card">Credit Card</option>
        <option value="paystack">Paystack</option>
      </select>
    </div>
  );
};

const Payments: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) navigate("/login");
  }, [authToken, navigate]);

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/payments/initiate/${bookingId}/`,
        { payment_method: paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "X-CSRFToken": getCsrfToken(), // Get CSRF token from cookies
            "Content-Type": "application/json",
          },
          withCredentials: true, // Required for CSRF
        }
      );

      if (response.data.approval_url) {
        window.location.href = response.data.approval_url;
      } else if (response.data.success) {
        setSuccess(true);
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Complete Your Payment</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Payment successful!</div>}

      <PaymentMethodDropdown value={paymentMethod} onChange={setPaymentMethod} />

      <button className="btn btn-primary btn-block mt-3" onClick={handlePayment} disabled={loading || !paymentMethod}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payments;
