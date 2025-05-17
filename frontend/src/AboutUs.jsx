import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import simpleDetails from "./utils/simpleDetails";

const loadDetails = () =>
  import(/* webpackChunkName: "details" */ "./utils/details");

const steps = [
  "Pulls Web and both Test repositories onto the Jenkins agent host.",
  "Launches the Web application locally on the Jenkins environment.",
  "Runs both regressions tests suites against the deployed Web-site on Jenkins's local host.",
  "Sends the regression test reports back to the developer.",
  "If regression pass, Jenkins deploys testing Web version to the production web-hosting.",
  "*** General setting-up for Jenkins Controller/Agent"
];

const AboutUs = () => {
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const storedUser = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const isAuthorized = storedUser === "slava__49";

  useEffect(() => {
    const handleBeforeUnload = () => { sessionStorage.removeItem("user"); };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sessionStorage.removeItem("user");
    };
  }, []);

  const handleStepClick = async (index) => {
    setSelectedStep(index);
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
  const whichDetails = isAuthorized ? detailsData : simpleDetails;// Choose which array to read from

  return (
    <div className="about-container">
      {/* Title Section */}
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
            {steps.map((step, idx) => (
              <li
                key={idx}
                onClick={() => handleStepClick(idx)}
                style={{
                  textDecoration:
                    selectedStep === idx ? "underline" : "none",
                  cursor: "pointer",
                }}
              >
                {step}
              </li>
            ))}
          </ul>

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
                    value={whichDetails[selectedStep] || ""}
                  />
                ) : (
                  <p>Click again to load details.</p>
                )
              ) : (
                <textarea
                  readOnly
                  rows={8}
                  value={whichDetails[selectedStep]}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Jenkins actions */}
      {selectedStep === null && (
        <div className="about-grid">
          <div className="about-card">
            <h3>Web site</h3>
            <p>modern, responsive code of React</p>
          </div>
          <div className="about-card">
            <h3>Regression</h3>
            <p>light and fast execution from Playwright</p>
            <p>performance API tests from Jmeter</p>
          </div>
        </div>
      )}

      <div className="about-cta">
        <button onClick={() => navigate("/contact")}>Contact Us</button>
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
