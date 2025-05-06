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

const details = [
  "Pulls both the Web and Test repositories onto the Jenkins agent host:\n"+
  "1. Generate PAT from GitHub\n(Profile -> Settings-> left.sidebar.Developer Settings->PersonalAccessToken ->\n"+
  "   select Fine-grained tokens -> Generate):\n"+
  "   Select the scopes (permissions) you want to grant the token. For example, for accessing repositories, you\n"+
  "   would select Repo.\n"+
  "   In the Token setting, define repository accessibility, token-expiration time and some permissions\n"+
  "   *** Click Generate token and copy it, cause it's going to be shown only 1 time !!! ***\n"+
  "2. Later, in Jenkins (Manage Jenkins > Manage Credentials) we'll need to grant the minimum required\n"+
  "   permissions for Jenkins to interact with the Repository Permissions. Below are the permissions Jenkins will\n"+
  "   require:\n"+
  `Permission	Why is it needed?	Level
        Metadata (Mandatory)	Allows Jenkins to list repositories and access basic info.	(Pre-selected, cannot be changed)
        Contents	Allows Jenkins to clone and fetch the repository code.	Read-only
        Actions	If using GitHub Actions for CI/CD, Jenkins might need this to trigger workflows.	Read-only or None
        Commit statuses	Allows Jenkins to update commit status (e.g., mark builds as passed/failed).	Read & Write
        Pull requests	If Jenkins is verifying PRs, this allows it to post build results.	Read-only or Read & Write
        Deployments (optional)	If Jenkins is deploying your app (e.g., to a server), this is needed.	Read & Write (Only if deploying)
        Secrets (optional)	Needed if your build uses GitHub Actions secrets.	None unless needed

        Account Permissions
        Most Account Permissions are NOT needed for Jenkins. However, if your pipeline interacts with GitHub users, consider these:
        Permission	Why is it needed?	Level
        Email addresses	If Jenkins needs user email info for notifications.	None
        Followers	Not needed.	None
        Private repository invitations	Not needed unless working with private repos.	None
`,
  "sssssssssssLaunches the Web application locally on the Jenkins environment.",
  "eeeeeeeeeeeeeeeeExecutes regression tests from the Test repository against the deployed Web application.",
  "gggggggggggggggSends the regression test report back to the developer.",
  "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr\n"+
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
              <textarea readOnly value={details[selectedStep]} />
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
