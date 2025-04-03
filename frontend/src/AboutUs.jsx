import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Import the custom styles

const AboutUs = () => {
  const navigate = useNavigate();  
  const handleContactClick = () => navigate('/contact');    
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h2 style={{ color: 'black' }}>We are your trusted partner in online sales, seamlessly connecting vendors and customers with confidence.</h2>
      </div>

      {/* About Section */}
      <div className="about-box">
        <h2>Who We Are</h2>
        <p>
          We find trusted vendors and offer a wide range of high-quality products.
          Our approach ensures convenience, reliability, and profitable cooperation.
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="about-grid">
        <div className="about-card">
          <h3>Vendor Partnerships</h3>
          <p>We collaborate with reliable vendors to ensure top-quality products.</p>
        </div>
        <div className="about-card">
          <h3>Business Growth</h3>
          <p>Helping you expand and reach more customers online.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-cta">
        <button onClick={handleContactClick}>Partner with Us</button>   
      </div>
    </div>
  );
};

export default AboutUs;
