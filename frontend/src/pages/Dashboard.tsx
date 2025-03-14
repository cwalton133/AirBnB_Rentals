import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Container,
  Spinner,
  Badge,
} from "react-bootstrap";
import { FaSearch, FaBed, FaBath, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import axios from "axios";

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  rating?: number | null;
  amenities: string[];
  is_available: boolean;
}

const Listing: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    amenities: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log("Fetching properties with filters:", filters); // Debugging log

      const response = await axios.get("http://127.0.0.1:8000/api/properties/", {
        params: {
          location: filters.location || undefined,
          min_price: filters.minPrice || undefined,
          max_price: filters.maxPrice || undefined,
          bedrooms: filters.bedrooms || undefined,
          amenities: filters.amenities || undefined,
        },
      });

      console.log("API Response:", response.data); // Debugging log

      setProperties(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleViewDetails = (id: number) => {
    navigate(`/property/${id}`);
  };

  return (
    <Container>
      <h2 className="mb-4">Find Your Perfect Rental</h2>
      <Form onSubmit={handleSearch} className="mb-4 p-4 bg-light rounded shadow">
        <Row className="g-3">
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaMapMarkerAlt />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </InputGroup>
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Min Price"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Max Price"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Bedrooms"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={3}>
            <Button variant="primary" type="submit" className="w-100">
              <FaSearch className="me-2" /> Search
            </Button>
          </Col>
        </Row>
      </Form>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {error && <p className="text-danger">{error}</p>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {properties.map((property) => (
          <Col key={property.id}>
            <Card className="h-100">
              <Card.Img variant="top" src={property.image_url} alt={property.title} />
              <Card.Body>
                <Card.Title>{property.title}</Card.Title>
                <div className="mb-2 text-muted">
                  <FaMapMarkerAlt className="me-1" /> {property.address}
                </div>
                <div className="mb-3">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < Math.floor(property.rating ?? 0) ? "text-warning" : "text-muted"}
                    />
                  ))}
                  <span className="ms-2">
                    ({property.rating !== null && property.rating !== undefined ? property.rating.toFixed(1) : "N/A"})
                  </span>
                </div>
                <Badge bg="light" text="dark" className="me-2">
                  <FaBed className="me-1" /> {property.bedrooms} Beds
                </Badge>
                <Badge bg="light" text="dark">
                  <FaBath className="me-1" /> {property.bathrooms} Baths
                </Badge>
                <Card.Text className="text-truncate">{property.description}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="outline-primary" className="w-100" onClick={() => navigate(`/property/${property.id}`)}>
                  View Details
                  </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      {properties.length === 0 && !loading && <p>No properties found. Try adjusting your search filters.</p>}
    </Container>
  );
};

export default Listing;
