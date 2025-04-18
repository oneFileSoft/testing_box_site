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
          Jenkins monitors the release branch of the Web repository. Upon detecting a push event, it performs the following actions:
        </p>
        <ul>
          <li>Pulls both the Web and Test repositories onto the Jenkins agent host.</li>
          <li>Launches the Web application locally on the Jenkins environment.</li>
          <li>Executes regression tests from the Test repository against the deployed Web application.</li>
          <li>Sends the regression test report back to the developer.</li>
          <li>If all tests pass, Jenkins deploys the new version to the production web hosting environment.</li>
        </ul>
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
