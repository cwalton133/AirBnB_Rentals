import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

const Listing: React.FC = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/properties/")
      .then((res) => setProperties(res.data))
      .catch((err) => setError("Failed to load properties. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <h2>Property Listings</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {properties.length === 0 && !loading && <Alert variant="info">No properties found. Try adjusting your search filters.</Alert>}
      {properties.map((property, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>{property.name}</Card.Title>
            <Card.Text>{property.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Listing;
