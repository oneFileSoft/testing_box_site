import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const actions = [
  "Pulls both the Web and Test repositories onto the Jenkins agent host.",
  "Launches the Web application locally on the Jenkins environment.",
  "Executes regression tests from the Test repository against the deployed Web application.",
  "Sends the regression test report back to the developer.",
  "If all tests pass, Jenkins deploys the new version to the production web hosting environment."
];

// Optional: you can prepare custom details for each line
const actionDetails = {
  0: "This step syncs the latest code from both repositories to the agent.",
  1: "A local build of the web app is launched in the Jenkins environment.",
  2: "The automation test suite is executed against the newly launched app.",
  3: "Results of the test suite are sent to the development team.",
  4: "Only if tests pass, Jenkins pushes the build to production."
};

const AboutUs = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleContactClick = () => navigate('/contact');

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h2 style={{ color: 'black' }}>CI / CD workflow</h2>
      </div>

      {/* About Section */}
      <div
        className={`about-box ${hoveredIndex !== null ? "shift-left" : ""}`}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {/* Jenkins Controller Section */}
        <div style={{ width: hoveredIndex !== null ? '60%' : '100%' }}>
          <h2>Jenkins controller</h2>
          <p>
            Jenkins monitors the release branch of the Web repository. Upon detecting a push event, it performs the following actions:
          </p>
          <ul>
            {actions.map((text, index) => (
              <li
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  textDecoration: hoveredIndex === index ? 'underline' : 'none',
                  cursor: 'pointer'
                }}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Details Section */}
        {hoveredIndex !== null && (
          <div className="details-box" style={{ width: '38%' }}>
            <h3>Details</h3>
            <textarea
              rows={6}
              style={{ width: '100%', padding: '8px' }}
              readOnly
              value={actionDetails[hoveredIndex]}
            />
          </div>
        )}
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


// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./App.css"; // Import the custom styles
//
// const AboutUs = () => {
//   const navigate = useNavigate();
//   const handleContactClick = () => navigate('/contact');
//   return (
//     <div className="about-container">
//       {/* Hero Section */}
//       <div className="about-hero">
//         <h2 style={{ color: 'black' }}>CI / CD workflow</h2>
//       </div>
//
//       {/* About Section */}
//       <div className="about-box">
//         <h2>Jenkins controller</h2>
//         <p>
//           Jenkins monitors the release branch of the Web repository. Upon detecting a push event, it performs the following actions:
//         </p>
//         <ul>
//           <li>Pulls both the Web and Test repositories onto the Jenkins agent host.</li>
//           <li>Launches the Web application locally on the Jenkins environment.</li>
//           <li>Executes regression tests from the Test repository against the deployed Web application.</li>
//           <li>Sends the regression test report back to the developer.</li>
//           <li>If all tests pass, Jenkins deploys the new version to the production web hosting environment.</li>
//         </ul>
//       </div>
//
//       {/* Why Choose Us Section */}
//       <div className="about-grid">
//         <div className="about-card">
//           <h3>Web site</h3>
//           <p>modern, responsive code of React.</p>
//         </div>
//         <div className="about-card">
//           <h3>Regression</h3>
//           <p>light and fast execution from Playwright</p>
//         </div>
//       </div>
//
//       {/* Call to Action */}
//       <div className="about-cta">
//         <button onClick={handleContactClick}>Contact Us</button>
//       </div>
//     </div>
//   );
// };
//
// export default AboutUs;
