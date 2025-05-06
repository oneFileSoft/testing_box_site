import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const steps = [
  "Pulls both the Web and Test repositories onto the Jenkins agent host.",
  "Launches the Web application locally on the Jenkins environment.",
  "Executes regression tests from the Test repository against the deployed Web application.",
  "Sends the regression test report back to the developer.",
  "If all tests pass, Jenkins deploys the new version to the production web hosting environment."
];

const AboutUs = () => {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h2 style={{ color: "black" }}>CI / CD workflow</h2>
      </div>

      {/* Jenkins Controller Box */}
      <div className="about-box">
        <div className={`controller-box ${selectedStep !== null ? "expanded" : ""}`}>
          <h2>Jenkins controller</h2>
          <p>
            Jenkins monitors the release branch of the Web repository. Upon detecting a push event, it performs the following actions:
          </p>

          <ul className="jenkins-list">
            {steps.map((step, index) => (
              <li
                key={index}
                onClick={() => setSelectedStep(index)}
                style={{
                  textDecoration: selectedStep === index ? "underline" : "none",
                  cursor: "pointer"
                }}
              >
                {step}
              </li>
            ))}
          </ul>

          {selectedStep !== null && (
            <div className="details-box">
              <h3>Detail</h3>
              <textarea readOnly value={steps[selectedStep]} />
            </div>
          )}
        </div>
      </div>

      {/* Why Choose Us Section */}
      {selectedStep === null && (
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
      )}

      {/* Contact CTA */}
      <div className="about-cta">
        <button onClick={() => navigate("/contact")}>Contact Us</button>
      </div>
    </div>
  );
};

export default AboutUs;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./App.css";
//
// const steps = [
//   "Pulls both the Web and Test repositories onto the Jenkins agent host.",
//   "Launches the Web application locally on the Jenkins environment.",
//   "Executes regression tests from the Test repository against the deployed Web application.",
//   "Sends the regression test report back to the developer.",
//   "If all tests pass, Jenkins deploys the new version to the production web hosting environment."
// ];
//
// const AboutUs = () => {
//   const navigate = useNavigate();
//   const [selectedStep, setSelectedStep] = useState(null);
//
//   return (
//     <div className="about-container">
//       {/* Hero Section */}
//       <div className="about-hero">
//         <h2 style={{ color: "black" }}>CI / CD workflow</h2>
//       </div>
//
//       {/* Jenkins Controller Box */}
//       <div className="about-box">
//         <div className="controller-box">
//           <h2>Jenkins controller</h2>
//           <p>
//             Jenkins monitors the release branch of the Web repository. Upon detecting a push event, it performs the following actions:
//           </p>
//
//           <ul className="jenkins-list">
//             {steps.map((step, index) => (
//               <li
//                 key={index}
//                 onClick={() => setSelectedStep(index)}
//                 style={{
//                   textDecoration: selectedStep === index ? "underline" : "none"
//                 }}
//               >
//                 {step}
//               </li>
//             ))}
//           </ul>
//         </div>
//
//         {selectedStep !== null && (
//           <div className="details-box">
//             <h3>Detail</h3>
//             <textarea
//               readOnly
//               rows={5}
//               value={steps[selectedStep]}
//             />
//           </div>
//         )}
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
//       {/* Contact CTA */}
//       <div className="about-cta">
//         <button onClick={() => navigate("/contact")}>Contact Us</button>
//       </div>
//     </div>
//   );
// };
//
// export default AboutUs;



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
