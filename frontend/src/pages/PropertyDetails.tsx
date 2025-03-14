// src/pages/PropertyDetails.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const property = {
    title: `Property ${id}`,
    image: "https://via.placeholder.com/600x300",
    price: "$100/night",
    description: "A beautiful apartment with modern amenities and a great location.",
    amenities: ["Wi-Fi", "Air Conditioning", "Swimming Pool", "Parking"],
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="shadow">
            <Card.Img variant="top" src={property.image} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>{property.title}</Card.Title>
              <Card.Text>
                <strong>Price: {property.price}</strong>
              </Card.Text>
              <Card.Text>{property.description}</Card.Text>
              <h5>Amenities</h5>
              <ul>
                {property.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
              <Button variant="success" className="w-100 mt-3">Book Now</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PropertyDetails;
