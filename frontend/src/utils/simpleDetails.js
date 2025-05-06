// src/utils/simpleDetails.js

const simpleDetails = [
  `Pulls both the Web and Test repositories onto the Jenkins agent host:
   1. Generate a GitHub Personal Access Token (PAT) to securely authenticate Jenkins.
      (Purpose: Allows Jenkins to clone repos without sharing passwords.)
   2. Add a webhook in your GitHub repo settings:
      • Payload URL: http://<Jenkins-IP>:8080/github-webhook/
      • Content type: application/json
      • Trigger: push event
      (Purpose: Immediately notifies Jenkins of code pushes, starting the CI process automatically.)
   3. Store the PAT as a “Username with password” credential in Jenkins.
      (Purpose: Securely manage authentication details without exposing sensitive tokens.)`,

  `Launches the Web application locally on the Jenkins environment:
   • cd frontend && npm install && npm run build
     (Purpose: Automatically installs dependencies from package.json, compiles, and bundles React code to detect build errors early.)
   • cd ../ && nohup node server.js > jenkins-local-server.log 2>&1 & SERVER_PID=$!
     (Purpose: Starts the backend server in the background, capturing its process ID (PID) to safely terminate it if it hangs. The pipeline includes a retry mechanism to confirm the web app started correctly.)`,

  `Executes regression tests from the Test repository against the deployed Web app:
   1. npm install --save-dev @playwright/test
   2. npx playwright install
   3. npx playwright install-deps || true
      (Purpose: Ensures the Playwright testing environment is correctly set up, including browser binaries.)
   4. Set baseURL=http://localhost:3000 in playwright.config.js
      (Purpose: Points all tests directly at the locally running application.)
   5. npx playwright test
      (Purpose: Runs comprehensive automated regression tests to identify potential issues before deployment.)`,

  `Sends the regression test report back to the developer:
   1. Configure SMTP settings in Jenkins → Manage Jenkins → Configure System:
      • SMTP server: smtp.ionos.com
      • Port: 587 (STARTTLS) or 465 (SSL)
      • Credentials: your IONOS email address/password
      (Purpose: Enables Jenkins to automatically email test results immediately after regression tests.)
   2. Optionally, configure “Extended E-mail Notification” with default recipients, subjects, and content templates.
      (Purpose: Delivers clear, structured notifications detailing the outcome of regression testing.)`,

  `If all tests pass, Jenkins deploys the new version to production:
   • Uses SSH credentials (sshagent) to securely log into your web-hosting environment.
   • Executes the build process locally on the hosting server, pulling the latest code, installing necessary packages, and restarting the website.
     (Purpose: Running deployment scripts directly on the web-hosting server avoids exposure of sensitive credentials, enhances deployment speed, and leverages elevated privileges like sudo for efficient script execution.)`,

  `*** General setup for Jenkins Controller/Agent:
   1. Install core dependencies: Java, Node.js, npm, Playwright, and MySQL.
      (Purpose: Prepares the agent environment with all tools required for continuous integration and testing workflows.)
   2. Configure GitHub, SSH, and database credentials within Jenkins Credentials Manager.
      (Purpose: Centrally secures and manages sensitive authentication details needed by your pipeline jobs.)
   3. Enable the “GitHub hook trigger for SCM polling” option in pipeline settings.
      (Purpose: Automatically starts Jenkins builds whenever code changes are pushed to your GitHub repository.)
   4. Finally, create a comprehensive Jenkins pipeline script responsible for:
      • Installing dependencies for Playwright and the WebSite at WORKSPACE-localhost (including database seeding).
      • Automatically running regression tests and emailing reports to developers.
      • Upon successful regression, automatically triggering the deployment and rebuilding of the latest website version on your web-hosting environment.
     (Purpose: Automates end-to-end delivery, improving efficiency and ensuring reliability with minimal manual intervention.)`
];

export default simpleDetails;
