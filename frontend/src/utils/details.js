const details = [
  `Pulls both the Web and Test repositories onto the Jenkins agent host:
  1. Generate PAT from GitHub
     (Profile -> Settings-> left.sidebar.Developer settings ->
         Personal Access Token -> select Fine-grained tokens -> Generate):
     Select the scopes (permissions) you want to grant the token. For example, for accessing repositories, you
     would select Repo.
     In the Token setting, define repository accessibility, token-expiration time and some permissions
     *** Click Generate token and copy it, cause it's going to be shown only 1 time !!! ***
  2. We can add a webhook to our repository so the next push will be picked up by Jenkins
     Go to: https://github.com/<my-GitHub-name>/<repo-name>/settings/hooks, or goto Setting from required repo
           Select "Add webhook"
           Fill in the following:
             Payload URL:                                          http://<Jenkins-IP>:8080/github-webhook/
             Content type:                                         application/json
             Which events would you like to trigger this webhook?  Select: Just the push event
             Click "Add webhook"
  3. Later, in Jenkins (Manage Jenkins > Manage Credentials) we'll need to grant the minimum required
     permissions for Jenkins to interact with the Repository Permissions.
     **Permission-name	             Why is it needed?	                                  Level
     Metadata (Mandatory)	Allows Jenkins to list repositories and access basic info.          Pre-selected
     Contents	            Allows Jenkins to clone and fetch the repository code.	            Read-only
     Actions   If using GitHub Actions for CI/CD, Jenkins might need this to trigger workflows.	Read-only or None
     Commit statuses	Allows Jenkins to update commit status (e.g., mark builds as passed/failed)  Read & Write
     Pull requests	    If Jenkins is verifying PRs, ability to post build results.	    Read-only or Read & Write
     Deployments (optional)	If Jenkins is deploying your app, this is needed.	 Read & Write (Only if deploying)
     Secrets (optional)	Needed if your build uses GitHub Actions secrets.	                   None unless needed
     **Account Permissions
     Most Account Permissions are NOT needed for Jenkins. However, if your pipeline interacts with GitHub users,
     consider these:
     Permission	Why is it needed?	Level
     Email addresses	      If Jenkins needs user email info for notifications.	None
     Followers	                    Not needed.	                                    None
     Private repository invitations	Not needed unless working with private repos.	None`,
  "Launches the Web application locally on the Jenkins environment.",
  "eeeeeeeeeeeeeeeeExecutes regression tests from the Test repository against the deployed Web application.",
  "gggggggggggggggSends the regression test report back to the developer.",
  "If all tests pass, Jenkins deploys the new version to the production web hosting environment.",
  `*** General setting-up for Jenkins Controller/Agent
   1. install Java21
       sudo add-apt-repository ppa:openjdk-r/ppa
       sudo apt update
       sudo apt install openjdk-21-jdk

       you may want to add this to .bashrc
             toWorkSpace() {
                  cd /var/lib/jenkins/workspace/run-deploy/
                  ll
             }
   2. Install Jenkins:
      sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
      echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]  https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
      sudo apt update
      sudo apt install jenkins
      Adjust firewall to listen port 8080 ---> url to web-Jenkins: http://<myIpAddress>:8080/
      you may use these command for autostart Jenkins:
          sudo systemctl start jenkins
          sudo systemctl enable jenkins
      this password will be required on the 1st login
          cat /var/lib/jenkins/secrets/initialAdminPassword   <some_hash>
      after loging to Jenkins install required Plugins

   3. NodeJs & npm : curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
                                sudo apt install nodejs=22.14.0-1nodesource1
                                sudo npm install -g npm@10.9.2
   4. Playwright - globally (just to save on resources + time of installation)
       npm install -g playwright@1.51.1
       npx playwright install chromium
       npx playwright install-deps
   5. installing MySql:
        sudo apt update
        sudo apt install mysql-server -y
        sudo systemctl status mysql
   6. setup jenkins with Email (or, just have API which going to be fulfilled from pipeline script):
        IONOS email:  my_email@myDomain.com      PS: <my-password-for-this-email>

       Step-by-Step: Configure Jenkins with IONOS Email
       1. Gather Your Email SMTP Info from IONOS
           Typically for IONOS:
           Field	Value
           SMTP Server	smtp.ionos.com
           SMTP Port	587 (with STARTTLS) or 465 (with SSL)
           Username	Your full email address (e.g., my_email@myDomain.com)
           Password	Your email account password (<my-password-for-this-email>)

           Go to Jenkins System Configuration
           Navigate to: Dashboard -> Manage Jenkins -> Configure System
           Under E-mail Notification section:
           Setting	                    Value
           SMTP server           	  smtp.ionos.com
           Use SMTP Authentication	  Yes
           User Name	        my_email@myDomain.com
           Password	Your IONOS email password
           Use SSL	Yes (for port 465) or leave unchecked if using port 587 with STARTTLS
           SMTP Port	465 for SSL or 587 for STARTTLS
           Reply-To Address	(optional) you@yourdomain.com
           Charset	UTF-8 (default is usually fine)

           Click the Test configuration by sending test e-mail to check.

           Under Extended E-mail NotificationἽ (if using emailext plugin):
            Setting	Value
            Default Recipients	recepient@yahoo.com
            Default Subject	(e.g.,) $PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!
            Default Content	(e.g.,) Build triggered by: $CAUSE Check details: $BUILD_URL
            SMTP server	smtp.ionos.com (same as above)
            Default user e-mail suffix	@yourdomain.com (optional)
   7. Setting up credentials
       Type of Credentials:   [Username with password]
          Username, enter your GitHub username.
          Password, paste the PAT you generated from GitHub earlier.
          Save this credential, and Jenkins will give you a credentialID -> -> -> <some_hash>
          later in groovy script: ...  git credentialsId: '<some_hash>', url: '<git-clone-url-for-the-branch>', branch: 'main' ...
       Type of Credentials:   [SSH Username with private key]
          Username: userNameOfcPanel-onHostingServer
          Password: entire record of private key from Jenkins host
          (Private Key: entire content of ~/.ssh/id_rsa from Jenkins host (no .pub))
          later in groovy script: ... stage('Deploy Website') { steps { sshagent(credentials: ['<generated_hash_key>']) { ...
       Type of Credentials:   [Username with password]
          Username: enter DB-User-name -> testUser (check - Treat username as secret)
          Password: DB-password value......
          ID: decription of action, for example my-db-password
          later in pipeline: we can create on fly ../config/db.js with credentials stored in just created CredentialID:
                 stage('Create DB Config File') {
                       environment {
                                             DB_CREDENTIALS = credentials('my-db-password')
                       }
                       steps {
                             script {
                                   echo "Creating db.js file with injected credentials..."
                                   dir("$ {WEBSITE_DIR}/config") {
                                   writeFile file: 'db.js', text: """
                                   module.exports = {
                                            user: '$ {DB_CREDENTIALS_USR}',
                                            password: '$ {DB_CREDENTIALS_PSW}',
                                            host: 'localhost',
                                            port: '3306',
                                            database: 'test_DB',
                                   };
                                   """.stripIndent()
                                   echo "../config/db.js created successfully!"
                                   }
                            }
                      }
                }
       FYI: configuration of direct access of SSH on host_1 from host_2:
          generate and copy id_rsa to correct places, so Jenkins will ssh to web-host and run command:
          1. on Jenkins(host2) hosting, run:  ssh-keygen -t rsa -b 4096 -C "jenkins@host2"  (click ENTER through - no passphrase needed)
          2. Copy the public key to your hosting server (web-site - host_1)
             You can do this securely:
             ssh-copy-id -p 21098 userNameOfcPanel-onHostingServer@IP-ofHostingServer
             If ssh-copy-id isn't available, do it manually: being on Jenkins-host -> cat ~/.ssh/id_rsa.pub
             Copy the output, then log into host_1 and paste it into:             ~/.ssh/authorized_keys
          3. make sure permissions are good on web-server host: chmod 700 ~/.ssh
                           chmod 600 ~/.ssh/authorized_keys
          4. test it:  ssh -o StrictHostKeyChecking=no -p 21098 userNameOfcPanel-onHostingServer@IP-ofHostingServer

  `
];
export default details;