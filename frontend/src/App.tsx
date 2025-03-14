// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Listings from "./pages/Listing";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Review from "./pages/Review";
import Booking from "./pages/Booking";
import BookingForm from "./pages/BookingForm";
import Details from "./pages/Details";



const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/review" element={<Review />} />
        <Route path="/booking/:id" element={<Booking />} /> {/* Fix: Ensure this route exists */}
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/property/:id" element={<Details />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
