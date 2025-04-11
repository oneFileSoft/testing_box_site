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
        <h2 style={{ color: 'black' }}>CI / CD workflow</h2>
      </div>

      {/* About Section */}
      <div className="about-box">
        <h2>Jenkins controller</h2>
        <p>
          Jenkins, listen for the push of the release branch of Web-repo, and run following actions:
           * pull WEB && Test repositories to the resided hosting.
           * run regression test from Test repo, on Web repo.
           * send back to Developer regression report.
           * if build success - new version been deployed to Web hosting by Jenkins
        </p>
      </div>

      {/* Why Choose Us Section */}
      <div className="about-grid">
        <div className="about-card">
          <h3>Web site</h3>
          <p>modern, responsive code of React.</p>
        </div>
        <div className="about-card">
          <h3>Regression</h3>
          <p>light and fast execution from Playwright</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-cta">
        <button onClick={handleContactClick}>Contact Us</button>
      </div>
    </div>
  );
};

export default AboutUs;
