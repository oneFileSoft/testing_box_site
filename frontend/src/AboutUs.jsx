// src/AboutUs.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

import simpleDetails from "./utils/simpleDetails";

// dynamic import for the “full” details
const loadDetails = () =>
  import(/* webpackChunkName: "details" */ "./utils/details");

const steps = [
  "Pulls both the Web and Test repositories onto the Jenkins agent host.",
  "Launches the Web application locally on the Jenkins environment.",
  "Executes regression tests from the Test repository against the deployed Web application.",
  "Sends the regression test report back to the developer.",
  "If all tests pass, Jenkins deploys the new version to the production web hosting environment.",
  "*** General setting-up for Jenkins Controller/Agent"
];

const AboutUs = () => {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // read user from sessionStorage
  const storedUser =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const isAuthorized = storedUser === "slava__49";

  const handleStepClick = async (index) => {
    setSelectedStep(index);

    // if authorized, load full details once
    if (isAuthorized && !detailsData) {
      setLoadingDetails(true);
      try {
        const mod = await loadDetails();
        setDetailsData(mod.default);
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h2 style={{ color: "black" }}>CI / CD workflow</h2>
      </div>

      {/* Jenkins Controller Box */}
      <div className="about-box">
        <div className="controller-box">
          <h2>Jenkins controller</h2>
          <p>
            Jenkins monitors the release branch of the Web repository. Upon
            detecting a push event, it performs the following actions:
          </p>

          <ul className="jenkins-list">
            {steps.map((step, i) => (
              <li
                key={i}
                onClick={() => handleStepClick(i)}
                style={{
                  textDecoration:
                    selectedStep === i ? "underline" : "none",
                  cursor: "pointer"
                }}
              >
                {step}
              </li>
            ))}
          </ul>

          {/* Detail area */}
          {selectedStep !== null && (
            <div className="details-box">
              <h3>Detail</h3>

              {isAuthorized ? (
                loadingDetails ? (
                  <p>Loading full details…</p>
                ) : detailsData ? (
                  <textarea
                    readOnly
                    rows={8}
                    value={detailsData[selectedStep]}
                  />
                ) : (
                  <p>Click again to load details.</p>
                )
              ) : (
                <textarea
                  readOnly
                  rows={8}
                  value={simpleDetails[selectedStep]}
                />
              )}
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
// import details from "./utils/details";
//
// const steps = [
//   "Pulls both the Web and Test repositories onto the Jenkins agent host.",
//   "Launches the Web application locally on the Jenkins environment.",
//   "Executes regression tests from the Test repository against the deployed Web application.",
//   "Sends the regression test report back to the developer.",
//   "If all tests pass, Jenkins deploys the new version to the production web hosting environment.",
//   "*** General setting-up for Jenkins Controller/Agent"
// ];
//
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
//       <div className={`about-box ${selectedStep !== null ? "expanded" : ""}`}>
//         <div className={`controller-box ${selectedStep !== null ? "expanded" : ""}`}>
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
//                   textDecoration: selectedStep === index ? "underline" : "none",
//                   cursor: "pointer"
//                 }}
//               >
//                 {step}
//               </li>
//             ))}
//           </ul>
//
//           {selectedStep !== null && (
//             <div className="details-box">
//               <h3>Detail</h3>
//               <textarea readOnly rows={8} value={details[selectedStep]} />
//             </div>
//           )}
//         </div>
//       </div>
//
//       {/* Why Choose Us Section */}
//       {selectedStep === null && (
//         <div className="about-grid">
//           <div className="about-card">
//             <h3>Web site</h3>
//             <p>modern, responsive code of React.</p>
//           </div>
//           <div className="about-card">
//             <h3>Regression</h3>
//             <p>light and fast execution from Playwright</p>
//           </div>
//         </div>
//       )}
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
