// src/pages/Home.tsx
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Container className="mt-4">
      {/* Hero Section */}
      <div className="hero-section text-center py-5 mb-5 bg-light rounded">
        <h1 className="display-4">Find Your Dream Rental</h1>
        <p className="lead">Explore the best apartments for rent at affordable prices.</p>
        <Link to="/listing">
          <Button variant="primary" size="lg">Browse Listings</Button>
        </Link>
      </div>

      {/* Featured Listings */}
      <h2 className="mb-4">Featured Properties</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {/* Sample property cards (replace with API data later) */}
        {[1, 2, 3].map((id) => (
          <Col key={id}>
            <Card className="property-card">
              <Card.Img variant="top" src="https://via.placeholder.com/350x200" />
              <Card.Body>
                <Card.Title>Luxury Apartment {id}</Card.Title>
                <Card.Text>Modern apartment with great amenities.</Card.Text>
                <Link to={`/property/${id}`}>
                  <Button variant="outline-primary" className="w-100">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
