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
 `Launches the Web application locally on the Jenkins environment.
     At this moment we already have Node.js installed globally. In order to setup WebSite on localhost,          cd frontend
     We need to reinstall node dependence which will be read from APP_FOLDER/frontend/package.json
     by running following commands from pipeline script:
              npm install
              npm run build
              cd ../
     In the end, it tries to capture PID of the started WebSite, so just in case of not responding,
     script automatically will shut down hanging process:
              npm install
              nohup node server.js > jenkins-local-server.log 2>&1 & SERVER_PID=$!`,
  `Executes regression tests from the Test repository against the deployed Web application.
     Enthought we have on Jenkins workspace Playwright installed globally,
     prior to run regression, we need to reinstall/refresh Playwright dependence, this is why in workspace
     we going to have these command to be executed by pipeline:
     1. npm install --save-dev @playwright/test
     2. npx playwright install
     3. npx playwright install-deps || true
     4. in playwright.config.js we need to define BaseUrl so Playwright test will refer to localhost of workspace`,
  `Sends the regression test report back to the developer.
       1. Gather Your Email SMTP Info from IONOS
                Typically for IONOS:
                Field	Value
                SMTP Server	smtp.ionos.com
                SMTP Port	587 (with STARTTLS) or 465 (with SSL)
                Username	Your full email address (e.g., my_email@myDomain.com)
                Password	Your email account password (<my-password-for-this-email>)

       2.       Go to Jenkins System Configuration
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

       3.       Click the Test configuration by sending test e-mail to check.
                Under Extended E-mail NotificationἽ (if using emailext plugin):
                 Setting	Value
                 Default Recipients	recepient@yahoo.com
                 Default Subject	(e.g.,) $PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!
                 Default Content	(e.g.,) Build triggered by: $CAUSE Check details: $BUILD_URL
                 SMTP server	smtp.ionos.com (same as above)
                 Default user e-mail suffix	@yourdomain.com (optional)`,
  `If all tests pass, Jenkins deploys the new version to the production web hosting environment.
     I'm using SSH to invoke build-process which sits at WebSite hosting server and automatically run
     full cycle of obtaining new version from GitHub, reinstalling latest updates, and
     restarting new version of WebSite.`,
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
      after logging to Jenkins install required Plugins

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
       Type of Credentials::::::::::::::::   [Username with password]
          Username, enter your GitHub username.
          Password, paste the PAT you generated from GitHub earlier.
          Save this credential, and Jenkins will give you a credentialID -> -> -> <some_hash>
          later in groovy script: ...  git credentialsId: '<some_hash>', url: '<git-clone-url-for-the-branch>', branch: 'main' ...
       Type of Credentials::::::::::::::::   [SSH Username with private key]
          Username: userNameOfcPanel-onHostingServer
          Password: entire record of private key from Jenkins host
          (Private Key: entire content of ~/.ssh/id_rsa from Jenkins host (no .pub))
          later in groovy script: ... stage('Deploy Website') { steps { sshagent(credentials: ['<generated_hash_key>']) { ...
       Type of Credentials::::::::::::::::   [Username with password]
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
       FYI: configuration of direct access of SSH on host_1(web-hosting) from host_2(Jenkins):
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
   8. Check "GitHub hook trigger for GITScm polling" in pipeline configuration.
      That will allow to turn ON feature of listening pushes of specific repos/branch from GitHub

    *****************************************************************
    *****************************************************************
    *****************************************************************
    ******************** playwright.config.js  **********************
    *****************************************************************
    *****************************************************************
    *****************************************************************

    // installation: npm init playwright@latest
    // ✅✅✅ page.locator() ✅✅✅
    // page.locator('#myId');            // Select by ID
    // page.locator('.myClass');         // Select by class
    // page.locator('[data-test="btn"]'); // Select by custom attribute
    // page.locator('button');           // Select by tag name
    // page.locator('button:has-text("Click Me")'); // Select by text inside button

        // await expect(myButton).toBeVisible();
        // await expect(myButton.isVisible()).toBeTruthy();

    //     page.getByRole() to locate by explicit and implicit accessibility attributes.
    // Element	    Use with getByRole()?	        How to Select?
    // Button	    ✅ Yes	                         getByRole('button', { name: 'Click Me' })
    // Link	      ✅ Yes	                         getByRole('link', { name: 'Home' })
    // Text Input	✅ Yes	                         getByRole('textbox', { name: 'Username' })
    // Checkbox	  ✅ Yes	                         getByRole('checkbox', { name: 'I agree' })
    // Label	    ❌ No	                         Use getByLabel('Label Text') instead
    // Textarea	  ✅ Yes	                         getByRole('textbox')
    // Image	    ✅ Yes	                         getByRole('img', { name: 'Profile picture' })


    // page.getByText() to locate by text content.
    // page.getByLabel() to locate a form control by associated label's text.
    // page.getByPlaceholder() to locate an input by placeholder.
    // page.getByAltText() to locate an element, usually image, by its text alternative.
    // page.getByTitle() to locate an element by its title attribute.
    // page.getByTestId() to locate an element based on its data-testid attribute (other attributes can be configured).
    // Method	                              Finds Elements Based On...	              Works On These Elements
    // ✅✅✅getByText('Text')✅✅✅ Visible text content	✅✅✅Any element with text (div, span, button, link, etc.)✅✅✅
    //                                                                                  !!! not case sencetive !!!!
    // getByLabel('Label Text')	               <label> associated with a form control	  <input>, <textarea>, <select>
    // getByPlaceholder('Placeholder Text')	   placeholder="..." attribute	            <input>, <textarea>
    // getByAltText('Alt Text')	               alt="..." attribute	                    <button>, <img>, <area>
    // getByTitle('Title Text')	               title="..." attribute	                  Any element with title
    // getByTestId('test-id')	                 data-testid="..." attribute	            Any element with data-testid

    // await page.getByLabel('User Name').fill('John');
    // await page.getByLabel('Password').fill('secret-password');
    // await page.getByRole('button', { name: 'Sign in' }).click();
    // await expect(page.getByText('Welcome, John!')).toBeVisible();
        // await expect (page.getByAltText('Home')).toBeVisible()
        // await expect(page.locator('.bar-icon.w-8.h-8.cursor-pointer.dim-icon')).toBeVisible();
    // await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
    // await page.getByRole('checkbox', { name: 'Subscribe' }).check();
    // await page.getByRole('button', { name: /submit/i }).click();
    // await page.getByLabel('Password').fill('secret');
    // expect(await page1.title()).toContain('Example');
    // expect (textNow1==="abcdefg").toBeTruthy();
    //   const msgBox = page.locator(".Toastify__toast").first();
    //   await msgBox.waitFor(); // Ensures it's visible before extracting text
    //   const messageText = await msgBox.textContent();
    // await page.getByRole('combobox').selectOption({value:"vitzislav.plakhin@arbatrade.us"});
    // await page.getByRole('combobox').selectOption({index:1});
    //<div class ="abcd" ></div>            .abcd     or   div[class="absd"]
    //<button id="myId"> Submit </button>   #myId     or   button[id="myId"]
    //<input type="text" name="uName">                     input[name="uName"]
    //<p>my text!!</p>  <h1>testing</h1>     p   */}

    // await page.getByTestId('inventory-item')
    //          .filter(has:page.getByRole('link',{name: 'T-short'})
    //           .click()

    // const { defineConfig } = require('@playwright/test');

    //const isDocker = process.env.IS_DOCKER === 'true'; //setUp from Dockerfile . ENV

    import { defineConfig } from '@playwright/test';

      export default defineConfig({
        use: {
          baseURL: process.env.BASE_URL || 'https://testingbox.pw',
        },
        testDir: "tests/",
        reporter: [
                    ['html', { outputFolder: 'playwright-report', attachments: false }],
                    ['junit', { outputFile: 'test-results/junit.xml' }]
        ],
      timeout: 30000, //global timeout for running tests... if it runs more - fail the test
      expect:{ timeout: 5000 },
      fullyParallel: true,
      workers: 1,
      retries:1,
      //use: {testidAttribute: 'data-test'},
      projects: [
        {
          name: 'chromium',
          use: {
             browserName: 'chromium',
             video: "retain-on-failure",
             trace: "retain-on-failure",
             screenshot: "on-first-failure"

            }
        }
        //,{ name: 'firefox', use: { browserName: 'firefox' }, trace: "retain-on-failure" },
        // { name: 'webkit',  use: { browserName: 'webkit' }, trace: "retain-on-failure" },
        // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      ]

      // brew install allure  //Reporter to use. See https://playwright.dev/docs/test-reporters
      // npm install -D allure-playwright
      // allure generate ./allure-results -o ./allure-report
      // allure open ./allure-report
      // reporter: [['html'], ['allure-playwright']],

      //,webServer: {   // Run your local dev server before starting the tests
      //   command: 'npm run start',
      //   url: 'http://127.0.0.1:3000',
      //   reuseExistingServer: !process.env.CI,
      // },
    });

    *****************************************************************
    *****************************************************************
    *****************************************************************
    *************************** tests  ******************************
    *****************************************************************
    *****************************************************************
    *****************************************************************
    /////////////////////////////////////////////////////
    ////////////////////////  home.spec.js:  ////////////
    /////////////////////////////////////////////////////
    import { test, expect } from '@playwright/test';
    import utils from './utils.js';
    test.describe.configure({ retries: 5 }); // specifically for this test number of retries will be 5 !!!!!

    let intVal = utils.getRandomInt();

    test('flacky test checking for even number (test.describe.configure({ retries: 5 });)', async ( ) => {
        console.log("test "+ intVal);
        expect (intVal%2 == 0).toBeTruthy();
      });

    ////////////////////////////////////////////////////////
    ////////////////////////  menuBar.spec.js:  ////////////
    ////////////////////////////////////////////////////////
    import { test, expect } from '@playwright/test';
    test('navigation throught menu Bar', async ({ page }) => {
        await page.goto('/');
        console.log(' ***********************    Current URL: ', page.url());
        await page.waitForLoadState();

        expect(await page.title()).toContain('testing area 51');
        await expect(page.getByRole('img', { name: 'Home' })).toBeVisible();
        await expect(page.locator('.bar-icon.w-8.h-8.cursor-pointer.dim-icon')).toBeVisible();

        await page.getByRole('img', { name: 'Contact' }).click();
        expect (await page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
        expect (await page.getByRole('button', { name: 'Submit' })).toBeVisible();

        await page.getByRole('img', { name: 'User-DB' }).click();
        expect (await page.getByRole('heading', { name: 'Login or insert new User' })).toBeVisible();
        expect (await page.getByRole('button', { name: 'Authenticate' })).toBeVisible();


        await page.getByRole('img', { name: 'About Jenkins' }).click();
        expect (await page.getByRole('heading', { name: 'Jenkins controller' })).toBeVisible();
        expect (await page.getByRole('heading', { name: 'Web site' })).toBeVisible();
        expect (await page.getByRole('heading', { name: 'Regression' })).toBeVisible();
        expect (await page.getByRole('button', { name: 'Contact Us' })).toBeVisible();

        await page.getByRole('button', { name: 'Contact Us' }).click();
        expect (await page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
        expect (await page.getByText("Submit")).toBeVisible();
      });

          //////////////////////////////////////////////////////////
          ////////////////////////  emailForm.spec.js:  ////////////
          //////////////////////////////////////////////////////////
import { test, expect } from '@playwright/test';
import utils from './utils.js';


test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState();
  await page.getByRole('img', { name: 'Contact' }).click();
});

test('Prevention of Submit of Email, with all empty fields', async ({ page }) => {
    expect (await page.locator('input[name="firstName"]').inputValue()).toBe('');

    await page.locator('input[name="firstName"]').click();
    await page.getByText('Submit').click();
    expect (await page.locator('input[name="firstName"]').getAttribute('placeholder')).toBe("First name is required");
    expect (await page.locator('input[name="lastName"]').getAttribute('placeholder')).toBe("Last name is required");
    expect (await page.locator('input[name="yourWebsite"]').getAttribute('placeholder')).toBe("Your website is required");
    expect (await page.locator('input[name="yourEmail"]').getAttribute('placeholder')).toBe("Your email is required");
    expect (await page.locator('textarea[name="message"]').getAttribute('placeholder')).toBe("Message is required");

    await page.getByRole('textbox', { name: 'First name is required' }).click();
    await page.getByRole('textbox', { name: 'First name is required' }).fill('John');
    await page.getByRole('textbox', { name: 'Last name is required' }).click();
    expect (await page.locator('input[name="firstName"]').getAttribute('placeholder')).toBe("");
  });

  test('Empty FirstName, lastName and message lost fokus', async ({ page }) => {
    await page.locator('input[name="firstName"]').click();
    await page.locator('input[name="lastName"]').click();

    expect (await page.locator('input[name="firstName"]').getAttribute('placeholder')).toBe("First name is required");
    expect (await page.locator('input[name="lastName"]').getAttribute('placeholder')).toBe(null);
    await page.locator('textarea[name="message"]').click();
    expect (await page.locator('input[name="firstName"]').getAttribute('placeholder')).toBe("First name is required");
    expect (await page.locator('input[name="lastName"]').getAttribute('placeholder')).toBe("Last name is required");
    expect (await page.locator('textarea[name="message"]').getAttribute('placeholder')).toBe(null);
    await page.locator('input[name="firstName"]').click();
    expect (await page.locator('input[name="firstName"]').getAttribute('placeholder')).toBe("First name is required");
    expect (await page.locator('input[name="lastName"]').getAttribute('placeholder')).toBe("Last name is required");
    expect (await page.locator('textarea[name="message"]').getAttribute('placeholder')).toBe("Message is required");
    expect (await page.locator('input[name="yourWebsite"]').getAttribute('placeholder')).toBe(null);
    expect (await page.locator('input[name="yourEmail"]').getAttribute('placeholder')).toBe(null);
  });

  test('Only message is empty', async ({ page }) => {
    await page.locator('input[name="firstName"]').fill("John");
    await page.locator('input[name="lastName"]').fill("Smith");
    await page.locator('input[name="yourWebsite"]').fill("www.myWebsite.com");
    await page.locator('input[name="yourEmail"]').fill("jsmith@yahoo.com");

    await page.getByText('Submit').click();

    expect (await page.locator('textarea[name="message"]').getAttribute('placeholder')).toBe("Message is required");
    expect (await page.getByText("Please, fill out all required")).toBeVisible();
    await page.waitForTimeout(7000);
    expect (await page.getByText('Please, fill out all required')).toBeHidden()
  });

  test('Successfull Email send', async ({ page }) => {
    console.log("Filling required fielsd (all *), and selecting specific Email-To from combo-box");
    console.log("All available options: " +
                "<select name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ width: "100%" }}>
                   <option value="test@testingbox.pw">General box: contact us</option>
                   <option value="jenkins_agent@testingbox.pw"> Company Management </option>
                   <option value="i_slava_i@yahoo.com"> Technical Support </option>
                </select>");
    const fName = "J" + utils.getRandomInt() + "J";
    await page.locator('input[name="firstName"]').fill(fName);
    const lName = "S" + utils.getRandomInt() + "S"
    await page.locator('input[name="lastName"]').fill(lName);
    const webSite = "www.abc" + utils.getRandomInt() + ".com"
    await page.locator('input[name="yourWebsite"]').fill(webSite);
    const email = "abc" + utils.getRandomInt() + "@yahoo.com"
    await page.locator('input[name="yourEmail"]').fill(email);
    await page.locator('textarea[name="message"]').fill("Test Email: " + fName + " " + lName);

    // await page.selectOption('select[name="email"]', 'jenkins_agent@testingbox.pw');  // option #1
    // const options = await page.locator('select[name="email"] >> option').all();      // option #2
    // await page.selectOption('select[name="email"]', await options[1].getAttribute('value'));
    // await page.selectOption('select[name="email"]', { label: 'Technical Support' }); //option #3
    await page.selectOption('select[name="email"]', { label: 'Technical Support' });
    // selection values from ComboBox:
    // following lane will always extract value of 1st (0) index:
    // const comboValue = await page.locator('select >> option').first().getAttribute('value');
    // this statement - will extract value of SELECTED index"
    const comboValue = await page.locator('select[name="email"]').inputValue();
    console.log("****Email test: F_Name = " + fName + ", L_Name = " + lName + " to: " + comboValue);

    await page.getByText('Submit').click();
    await page.waitForSelector('.Toastify__toast--success', { state: 'visible' });
    const toastText = (await page.locator('.Toastify__toast--success').textContent()).replace('\n', '');

    expect (toastText).toContain(fName + " " + lName + "Your email has been sent successfully!");

    expect (await page.locator('input[name="firstName"]').getAttribute('placeholder')).toBe(null);
    expect (await page.locator('input[name="lastName"]').getAttribute('placeholder')).toBe(null);
    expect (await page.locator('input[name="yourWebsite"]').getAttribute('placeholder')).toBe(null);
    expect (await page.locator('input[name="yourEmail"]').getAttribute('placeholder')).toBe(null);
    expect (await page.locator('textarea[name="message"]').getAttribute('placeholder')).toBe(null);
  });

  // test('Only message is empty -failing test', async ({ page }) => {
  //   await page.getByRole('img', { name: 'Contact' }).click();
  //   await page.locator('input[name="firstName"]').fill("John");
  //   await page.locator('input[name="lastName"]').fill("Smith");
  //   await page.locator('input[name="yourWebsite"]').fill("www.myWebsite.com");
  //   await page.locator('input[name="yourEmail"]').fill("jsmith@yahoo.com");
  //   await page.getByText('Submit').click();
  //   expect (await page.locator('textarea[name="message"]').getAttribute('placeholder')).toBe("Message is --- required");
  // });

            ///////////////////////////////////////////////////////////////////////////
            ////////////////////////  authenticationLocalStorage.spec.js:  ////////////
            ///////////////////////////////////////////////////////////////////////////
  import { test, expect } from '@playwright/test';
  import utils from './utils.js';

  let uName = "";
  let pswrd = "";

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    console.log(' ***********************    Current URL: ', page.url());
    await page.waitForLoadState();
    await page.getByRole('img', { name: 'Storage' }).click();
    const data = await utils.getLocalStorage(page);
    expect(data.credentials == '' || data.credentials === undefined).toBeTruthy;
    const textContainingCredentials = await page.locator('h2').innerText();
    uName = utils.extractBetween(textContainingCredentials, "Username: ", ", Password");
    pswrd = utils.extractBetween(textContainingCredentials, ", Password: ", null)
    console.log("for this session: UserNAme: " + uName + " Pass: " + pswrd);
  });

  test('Wrong UserName', async ({ page }) => {
    await page.locator('input[placeholder="Username"]').fill('abc');
    await page.locator('input[placeholder="Password"]').fill(pswrd);
    await page.getByText('Submit').click();
    const err = await page.getByText('Error login').innerText();
    expect (err).toBe("Error login");
    const data = await utils.getSessionStorage(page);
    expect (data.credentials != undefined).toBeTruthy;
    expect (data.credentials).toBe("wrong user name.");
    expect (data.userName).toBeUndefined();
  });

  test('Empty UserName', async ({ page }) => {
    await page.locator('input[placeholder="Password"]').fill(pswrd);
    await page.getByText('Submit').click();
    const err = await page.getByText('Error login').innerText();
    expect (err).toBe("Error login");
    const data = await utils.getSessionStorage(page);
    expect (data.credentials !== undefined).toBeTruthy();
    expect (data.credentials == "wrong user name.").toBeTruthy();
  });

  test('Wrong Password', async ({ page }) => {
    await page.locator('input[placeholder="Username"]').fill(uName);
    await page.locator('input[placeholder="Password"]').fill("pswrd");
    await page.getByText('Submit').click();
    const err = await page.getByText('Error login').innerText();
    expect (err).toBe("Error login");
    const colorOfTheMessage =  await utils.getComputedStyleProperty(page, page.getByText('Error login'), 'color');
    console.log(colorOfTheMessage);
    expect(colorOfTheMessage).toBe("rgb(255, 0, 0)"); // means red
    const data = await utils.getSessionStorage(page);
    expect (data.credentials !== undefined).toBeTruthy();
    expect (data.credentials).toBe("wrong password.");
  });

  test('Correct credentials', async ({ page }) => {
    await page.locator('input[placeholder="Username"]').fill(uName);
    await page.locator('input[placeholder="Password"]').fill(pswrd);
    await page.getByText('Submit').click();
    const logSuccess = await page.getByText("User " + uName + " has been logged");
    expect (logSuccess).toBeVisible();
    const data = await utils.getSessionStorage(page);
    expect (data.credentials !== undefined).toBeTruthy();
    expect (data.credentials).toBe("authentication OK.");
    expect (data.userName != undefined && data.userName == uName).toBeTruthy;
    expect (data.password != undefined && data.password == pswrd).toBeTruthy;
  });

  test('LocalStore value exist after successfull authentication and navigating to Home-page', async ({ page }) => {
    await page.locator('input[placeholder="Username"]').fill(uName);
    await page.locator('input[placeholder="Password"]').fill(pswrd);
    await page.getByText('Submit').click();
    const logSuccess = await page.getByText("User " + uName + " has been logged");
    expect (logSuccess).toBeVisible();
    const colorOfTheMessage = await utils.getComputedStyleProperty(page, logSuccess, 'color');
    expect (colorOfTheMessage).toBe("rgb(0, 128, 0)"); // means green
    await page.getByRole('img', { name: 'Home' }).click();
    const data = await utils.getSessionStorage(page);
    expect (data.credentials !== undefined).toBeTruthy();
    expect (data.credentials).toBe("authentication OK.");
    expect (data.userName != undefined && data.userName == uName).toBeTruthy();
    expect (data.password != undefined && data.password == pswrd).toBeTruthy();
  });

            ////////////////////////////////////////////////////////////////
            ////////////////////////  userFormApi.spec.js:  ////////////////
            ////////////////////////////////////////////////////////////////

import { test, expect } from '@playwright/test';
import utils from './utils';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  console.log(' ***********************    Current URL: ', page.url());
  await page.waitForLoadState();
});

test('negative - User obey 25 characters lenght', async ({ page }) => {
  await page.getByRole('img', { name: 'User-DB' }).click();
  await page.locator('#uname').fill('asdfghjklqwertyuiop01234567890');
  await page.locator('#passw').fill('test');
  const fieldText = await page.locator('#uname').inputValue();
  expect (fieldText).toBe("asdfghjklqwertyuiop012345");
});

test('Wrong User name', async ({ page }) => {
  await page.getByRole('img', { name: 'User-DB' }).click();
  await page.locator('#uname').fill('test1');
  await page.locator('#passw').fill('test');
  await page.getByRole('button', { name: 'Authenticate' }).click();

  const messageText = await utils.getTextFromToast(page);
  expect (messageText).toContain("Error during login: Invalid username or password");
  expect (await page.getByRole('textbox', { name: 'Description' })).toBeHidden();
});

test('Wrong password', async ({ page }) => {
  await page.getByRole('img', { name: 'User-DB' }).click();
  await page.locator('#uname').fill('test');
  await page.locator('#passw').fill('test1');
  await page.getByRole('button', { name: 'Authenticate' }).click();

  const messageText = await utils.getTextFromToast(page);
  expect (messageText).toContain("Error during login: Invalid username or password");
  expect (await page.getByRole('textbox', { name: 'Description' })).toBeHidden();
  const data = await utils.getSessionStorage(page);
  expect (data.user).toBeUndefined();
});

test('Authenticate existing User', async ({ page }) => {
  await page.getByRole('img', { name: 'User-DB' }).click();
  await page.getByRole('textbox', { name: 'Your User Name' }).fill('test');
  await page.getByRole('textbox', { name: 'Your User Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Your Password' }).fill('test');
  await page.getByRole('textbox', { name: 'Your Password' }).press('Tab');
  await page.getByRole('button', { name: 'Authenticate' }).click();
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('textbox', { name: 'Description' }).fill('');
  expect (await page.getByRole('textbox', { name: 'Description' })).toBeVisible();

  expect (await page.getByPlaceholder('Total Amount')).toBeVisible();
  expect (await page.locator('input[type="date"]')).toBeVisible();
  //following, because they have unique type - easy to capture by locator
  // expect (await page.locator('input[type="date"]').isVisible()).toBeTruthy();
  expect (page.getByRole('heading', { name: 'Add Expense for test' })).toBeVisible();
  await page.waitForFunction(() => sessionStorage.getItem("user") !== null);
  const data = await utils.getSessionStorage(page);
  expect (data.user).toContain("test__46");
});

/******************************************************/
/**************** API tests ***************************/
/******************************************************/


//{"success":true,"expenses":[{"id":159,"userId":46,"transDescr":"descriptions 2 for Test","transDate":"2025-05-02T12:33:48.000Z","transTotal":83.73},{"id":131,"userId":46,"transDescr":"descriptions 1 for Test","transDate":"2025-05-02T12:33:33.000Z","transTotal":107.81}]}
test('Api test --- GET', async ({ request }, testInfo) => {
  const endpoint = "/getExpenses?userId=46";
  const resp = await request.get(endpoint);

  // Get baseURL from test info config
  const baseURL = testInfo.project.use.baseURL;
  console.log(' ***********************    API - URL: '+baseURL+endpoint);
  console.log("RESPONSE TEXT: ", await resp.text());
  expect (resp.status()).toBe(200);

  const text = await resp.text();
  console.log("text from GET: " + text);

  const bodyRaw = await resp.body();
  const body = bodyRaw.toString();
  const respBody =  JSON.parse(body);
  console.log("body from GET: " + body);
  // Access specific keys-values in respBody
  console.log("specific values from: respBody.expenses[0].userId=" + respBody.expenses[0].userId +
    ", respBody.expenses[0].transDescr="+respBody.expenses[0].transDescr);
    console.log("respBody.expenses[0].transDescr = "+ respBody.expenses[0].transDescr );
  let descriptionFound = false;
  for (const expenseItem of respBody.expenses) {
    if (expenseItem.transDescr === "descriptions 1 for Test") {
      descriptionFound = true;
      break;
    }
  }
  expect(descriptionFound).toBeTruthy();
});

//res.status(404).json({ success: false, message: "User not found" })
test('Api test --- Post - INSERT - no User found', async ({ request }) => {
  const response = await request.post('/insertExpense', {
    data: {
      userId: '9999',
      transDescr: 'Test from Playwright',
      transTotal: '15.75',
      transDate: '2025-04-22T00:00:00-05:00'
    }
  });
  expect (response.status()).toBe(404);
  const body = await response.json();// Parse JSON body from response
  expect (body.success).toBe(false);  // Assert on the body
  expect (body.message).toBe("User not found");

});

//res.status(500).json({ success: false, message: "Error inserting user expences to DB", error: error.message });
test('Api test --- Post - INSERT - invalid amount', async ({ request }, testInfo) => {
  const response = await request.post('/insertExpense', {
    data: {
      userId: '46',
      transDescr: 'Test from Playwright',
      transTotal: 'abc',
      transDate: '2025-04-22T00:00:00-05:00'
    }
  });
  expect (response.status()).toBe(500);
  const body = await response.json();// Parse JSON body from response
  expect (body.success).toBe(false);  // Assert on the body
  expect (body.message).toBe("Error inserting user expences to DB");
});

/*****************************************************************/
/*****************************************************************/
/*********************** End To End API **************************/
/*****************************************************************/
/*****************************************************************/
async function findMatchInDataSet(request, endpoint, dataKey, fieldName, expectedValue, additionalKeyValuesToPrint = undefined ) {
  const confirmResp = await request.get(endpoint);
  const confirmBody = await confirmResp.json();
  console.log("  --- "+confirmBody.toString());
  const records = confirmBody[dataKey];
  console.log("  --- checking if "+dataKey+"."+fieldName+" contain: " + expectedValue);
  console.log("  --- Number of " + dataKey +" = " + records.length);
  const found = records.some(item => item[fieldName] === expectedValue);
  console.log("  --- ExpectedValue($ {expectedValue}) found in $ {dataKey}.$ {fieldName} = $ {found}");
  let arrAdditionals = [];
  if (additionalKeyValuesToPrint !== undefined) {
       arrAdditionals = additionalKeyValuesToPrint.split(",");
  }
  for (let i = 0; i < records.length; i++) {
    let line = "  --- #" + i + " " + fieldName + ": " + records[i][fieldName];
    for (let j = 0; j < arrAdditionals.length; j++) {
      line += " | "+ arrAdditionals[j] + ": " + records[i][arrAdditionals[j]];
    }
    console.log(line);
  }
}
/////e2e-api
//res.status(200).json({ success: true, message: "User expenses include " + transDescr + " for the amount + " + transTotal + " inserted successfully!"
test('Api test --- INSERT(Post) - GET(get) - DELETE(Delete) by GIU', async ({ page, request }) => {
  let generatedId = 0;
  const myNumb = parseFloat("{utils.getRandomInt()}.$ {utils.getRandomInt()}");
  const transDecr = "Test from Playwright " + myNumb;
  await page.evaluate(() => sessionStorage.clear());
  await findMatchInDataSet(request, "/getExpenses?userId=45", "expenses", "transDescr", transDecr);

  await test.step("step#1: INSERT new activities by API", async() => {
    console.log("Step#1 - insert to user = Test (45) new expence record: " + transDecr);
    const response = await request.post('/insertExpense', {
      data: {
        userId: '45',
        transDescr: transDecr,
        transTotal: myNumb,
        transDate: '2025-04-22T00:00:00-05:00'
      }
    });
    expect (response.status()).toBe(200);
    const body = await response.json();// Parse JSON body from response
    expect (body.success).toBe(true);  // Assert on the body
    expect (body.message).toBe("User expenses include " + transDecr + " for the amount + " + myNumb + " inserted successfully!");
    generatedId = body.insertedId; // ✅ This is where the ID lives
    console.log("Step#1 - For sake of imidiate verification of correctness of working [/insertExpense API],");
    console.log("      will verify just inserted record with [/getExpenses API] specifically for taransDescr="+transDecr)
      // const confirmResp = await request.get("/getExpenses?userId=45");
      // const confirmBody = await confirmResp.json();
      // const inserted = confirmBody.expenses.some(item => item.transDescr === transDecr);
      // console.log("Step#1 - umber transDescr ["+transDecr+"] is found: " + inserted);
      // expect(inserted).toBe(true);
    await findMatchInDataSet(request, "/getExpenses?userId=45", "expenses", "transDescr", transDecr);
  });

  await test.step("Step#2: Checking inserted activities available with GET-API (with 3 loops)", async() => {
    const endpoint = "/getExpenses?userId=45";
    const resp = await request.get(endpoint);
    expect (resp.status()).toBe(200);
    const body = await resp.json();
    // example of JSON:  body.expenses[0].userId, body.expenses[0].transDescr
    console.log("Step#2 - for demo purpose, looking for generatedId and transDescr in 3 type of loops");
    console.log("Step#2 - loop1:   for (const expenseItem of body.expenses) {...}");
    let expenceFound = false;
    for (const expenseItem of body.expenses) {
      if (expenseItem.id == generatedId && expenseItem.transDescr === transDecr) {
        expenceFound = true;
        break;
      }
    }
    expect(expenceFound).toBe(true);

    console.log("Step#2 - loop2:   body.expenses.forEach(expenseData => {...}");
    expenceFound = false;
    body.expenses.forEach(expenseData => {
      if (expenseData.id == generatedId && expenseData.transDescr === transDecr) {
        expenceFound = true;
      }
    });
    expect(expenceFound).toBe(true);

    console.log("Step#2 - loop3:   for (let i = 0; i < body.expenses.length; i++) {...}");
    for (let i = 0; i < body.expenses.length; i++) {
      if (body.expenses[i].id == generatedId && body.expenses[i].transDescr === transDecr) {
        expenceFound = true;
        break;
      }
    }
    expect(expenceFound).toBe(true);
    console.log("Step#2 - expected expence is found = " + expenceFound);
  });

  await test.step("step#3: Verification of new activities appearance from GUI", async () => {
    console.log("Step#3 - loggin into the system with John credentials to see added record");
    // Inject login debugger
    await page.route('/login', async (route, request) => {
    const postData = request.postDataJSON();
    console.log('🎯 Intercepted /login payload:', postData);
    route.continue();
    });
    //clicking between component to reset SessionStorage in natural way
    await page.getByRole('img', { name: 'Storage' }).click();
    await page.getByRole('img', { name: 'Home' }).click();
    await page.evaluate(() => {
      if (typeof window.loadTable === 'function') {
        window.loadTable();
      }
    });
    await page.waitForLoadState('networkidle');
    await page.getByRole('img', { name: 'User-DB' }).click();
    await page.locator('#uname').fill('John');
    await page.locator('#passw').fill('John');

    console.log("Step#3 - block to wait with login tracking");
    const [loginResponse] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/login') && res.status() < 500),
      page.getByRole('button', { name: 'Authenticate' }).click()
    ]);

    const loginRequest = loginResponse.request();
    const requestBody = loginRequest.postDataJSON();
    const responseBody = await loginResponse.json();

    console.log('🔐 Login request payload:', requestBody);
    console.log('📬 Login response payload:', responseBody);

    const sessionUser = await utils.getSessionStorage(page);
    console.log("Step#3 - sessionStorage.user:", sessionUser.user);
    expect(sessionUser.user).toContain("John__45");

    await page.waitForSelector('tr td:first-child');
    await expect(page.locator('tr td:first-child').first()).toBeVisible();

      console.log("Step#3 - wait-for-text block");
      let foundDecription = false;
      const waitInterval = 400;
      let tries = 0;
      while (!foundDecription && tries < 10) {
        const activityTexts = await page.locator('tr td:first-child').allTextContents();
        console.log("[Try #$ {tries}] Found rows:" + activityTexts);
        if (activityTexts.includes(transDecr)) {
          console.log("✅ Found inserted description: " + transDecr);
          foundDecription = true;
          break;
        }
        await page.waitForTimeout(waitInterval); // equvalent of sleep in milliseconds
        tries++;
      }
              //   const rows = page.locator('tbody tr');
              //   const rowCount = await rows.count();
              //   console.log("Step#3 - total number of records: " + rowCount);
              //   const row = rows.nth(0);
              //   const column0 = await row.locator('td').nth(0).innerText();
              //   const column1 = await row.locator('td').nth(1).innerText();
              //   console.log("Step#3 - -----1st row: " + column0 + " " + column1);
              //   // ///////  just another way to browse trough table:
              //   // //////////////////////    collecting 1st column to array   /////////////////////
              //   // const activityTexts = await page.locator('tr td:first-child').allTextContents();
              //   // let foundDecription = false;
              //   // activityTexts.forEach((text) => {
              //   //   if (text === transDecr) {
              //   //     foundDecription = true;
              //   //   }
              //   // });
              //   // if (! foundDecription) {
              //   //   for (let i = 0; i < activityTexts.length; i++) {
              //   //     if (activityTexts[i]  === transDecr) {
              //   //       foundDecription = true;
              //   //       break;
              //   //     }
              //   //   }
              //   // }
      console.log("Step#3 - After loop: Found inserted description: " + foundDecription);
      expect(foundDecription).toBe(true);
      await page.getByRole('img', { name: 'Home' }).click();
  });

  await test.step("step#4: Delete this activities from GIU (by: userId + id)", async() => {
    await page.getByRole('img', { name: 'Storage' }).click();
    await page.getByRole('img', { name: 'Home' }).click();
    await page.getByRole('img', { name: 'User-DB' }).click();
    await page.locator('#uname').fill('John');
    await page.locator('#passw').fill('John');
    await page.getByRole('button', { name: 'Authenticate' }).click();
    await page.waitForLoadState('domcontentloaded');
    // very important to wait bfere table will load to GUI
    await page.waitForSelector('tr td:first-child');
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    console.log("Step#4 - total number of records before I clicked on Delete button: " + rowCount);
    console.log("Step#4 - going to loop trough rows of table to find new transDesr");

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const descr = await row.locator('td').nth(0).innerText(); // first column (Description)
      // const amount = await row.locator('td').nth(1).innerText(); // second column (Amount)
      // const date   = await row.locator('td').nth(2).innerText(); // third column (Date)
      if (descr === transDecr) {
        console.log("Step#4 in the loop of rows, found match of descriptions: " + transDecr);
        page.once('dialog', dialog => {
          //        OK                           Cancel
          console.log("Step#4 - [delete] button clicked, we are in confurmation Dialog to accept it");
          dialog.accept().catch(() => {});// dialog.dismiss().catch(() => {});
        });
        // await row.locator('td').nth(3).getByRole('button', { name: /delete/i }).click();
        // await page.getByRole('row', { name: 'Test from Playwright 35.19 35' }).getByRole('button').click();
        // await page.locator('tr').filter({ hasText: transDecr }).locator('button').click();
        // await page.locator('tr:has-text("Test from Playwright 35.19")').locator('button').click();
        await page.locator("bendedComa"tr:has-text("$ {transDecr}")"bendedComa").locator('button').click();
        break;
      }
    }
    await page.getByRole('img', { name: 'Home' }).click();
  });

  await test.step("step#5: Verification of new activities is GONE from GIU!", async() => {
    console.log("Step#5 - re-loging wit hJohn's credentioal to confirm record is gone");
    await page.getByRole('img', { name: 'User-DB' }).click();
    await page.locator('#uname').fill('John');
    await page.locator('#passw').fill('John');
    await page.getByRole('button', { name: 'Authenticate' }).click();
    await page.waitForLoadState('domcontentloaded');
    // very important to wait before table will load to GUI
    await page.waitForSelector('tr td:first-child');
    console.log("Step#5 - collecting 1st column 'Descriptions' to array");
    const activityTexts = await page.locator('tr td:first-child').allTextContents();
    let foundDecription = false;
    activityTexts.forEach((text) => {
      if (text === transDecr) foundDecription = true;
    });
    console.log("Step#5 - confirming that transDescr is not found " + (!foundDecription));
    expect (foundDecription).toBe(false);
    await page.getByRole('img', { name: 'Home' }).click();
  });

  await test.step("step#6: Verification of new activities is GONE by API-Get", async() => {
    console.log("Step#6 - using /getExpenses API to confirm it not returning deleted record");
    const endpoint = "/getExpenses?userId=45";
    const resp = await request.get(endpoint);
    expect (resp.status()).toBe(200);
    const body = await resp.json();
    // example of JSON:  body.expenses[0].userId, body.expenses[0].transDescr

    let expenceFound = false;
    for (const expenseItem of body.expenses) {
      if (expenseItem.id == generatedId && expenseItem.transDescr === transDecr) {
        expenceFound = true;
        break;
      }
    }
    expect(expenceFound).toBe(false);
  });

  console.log("API Insert-Get-Delete end-to-end test (Delete by GUI) is done!")
});

/////e2e-api
test('Api test --- INSERT(Post) - GET(get) - DELETE(Delete) by API', async ({ page, request }) => {
  let generatedId = 0;
  const myNumb = parseFloat("bendedComa"$ {utils.getRandomInt()}.$ {utils.getRandomInt()}"bendedComa");
  const transDecr = "Test from Playwright " + myNumb;

  await test.step("step#1: INSERT new activities by API", async() => {
    console.log("decimal number using in test = " + myNumb);
    const response = await request.post('/insertExpense', {
      data: {
        userId: '45',
        transDescr: transDecr,
        transTotal: myNumb,
        transDate: '2025-04-22T00:00:00-05:00'
      }
    });
    expect (response.status()).toBe(200);
    const body = await response.json();// Parse JSON body from response
    expect (body.success).toBe(true);  // Assert on the body
    expect (body.message).toBe("User expenses include " + transDecr + " for the amount + " + myNumb + " inserted successfully!");
    generatedId = body.insertedId; // ✅ This is where the ID lives
  });

  await test.step("step#2: Checking inserted activities available with GET-API", async() => {
    const endpoint = "/getExpenses?userId=45";
    const resp = await request.get(endpoint);
    expect (resp.status()).toBe(200);
    const body = await resp.json();
    // example of JSON:  body.expenses[0].userId, body.expenses[0].transDescr......
    let expenceFound = false;
    for (const expenseItem of body.expenses) {
      if (expenseItem.id == generatedId && expenseItem.transDescr === transDecr) {
        expenceFound = true;
        break;
      }
    }
    expect(expenceFound).toBe(true);
  });

  await test.step("step#3: Delete this activities from by API (by: userId + transDescr)", async() => {
    const response = await request.delete('/deleteExpense', {
      data: {
        userId: 45,
        transDescr: transDecr
      }
    });

    const respBody = await response.json();

    expect(response.status()).toBe(200);
    expect(respBody.success).toBe(true);
    expect(respBody.message).toBe("Expense deleted successfully");
  });

  await test.step("step#4: Verification of new activities is GONE by API-Get", async() => {
    const endpoint = "/getExpenses?userId=45";
    const resp = await request.get(endpoint);
    expect (resp.status()).toBe(200);
    const body = await resp.json();
    // example of JSON:  body.expenses[0].userId, body.expenses[0].transDescr
    let expenceFound = false;
    for (const expenseItem of body.expenses) {
      if (expenseItem.id == generatedId && expenseItem.transDescr === transDecr) {
        expenceFound = true;
        break;
      }
    }
    expect(expenceFound).toBe(false);
  });

  console.log("API Insert-Get-Delete end-to-end test (Delete by API) is done!")
});

            /////////////////////////////////////////////////////////////////////
            ////////////////////////  regressionReport.spec.js:  ////////////////
            /////////////////////////////////////////////////////////////////////
import { test, expect } from '@playwright/test';
import { parseISO, format } from 'date-fns';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  console.log(' ***********************    Current URL: ', page.url());
  await page.waitForLoadState();
});

test('Regression Report counter and comparing repor Date', async ({ page }) => {
  await page.getByRole('img', { name: 'RegrReport' }).click();
  await page.waitForLoadState('networkidle');
  const count = await page.locator('a').count();
  expect (count > 1).toBeTruthy();
  const dateInput = page.locator('input[type="date"]');
  const dateFromCalendar = await dateInput.inputValue();
  console.log("Date from calendar: " + dateFromCalendar);
  const dateFromCalendar1 = parseISO(dateFromCalendar);
  const date1 = format(dateFromCalendar1, 'yyyy-MM-dd');

  // await page.locator('a').first().click();
  // const dateFromReport = await page.locator('iframe[title="HTML Report"]').contentFrame().getByTestId('overall-time').innerText();
  // console.log("Date from report: " + dateFromReport);//Date: 4/26/2025, 10:19:22 AM is NOT parsable by parseISO

  // const dateFromReport1 = new Date(dateFromReport);
  const dateFromReport1 = new Date();
  const date2 = format(dateFromReport1, 'yyyy-MM-dd');
  expect (date1).toBe(date2)
});

    ///////////////////////////////////////////////////////////
    /////////////////////  utils.js  //////////////////////////
    ///////////////////////////////////////////////////////////

function extractBetween(text, startMarker, endMarker = null) {
    const startIndex = text.indexOf(startMarker);
    if (startIndex === -1) return null;
    const from = startIndex + startMarker.length;
    if (endMarker === null) return text.substring(from).trim();
    const endIndex = text.indexOf(endMarker, from);
    if (endIndex === -1) return null;
    return text.substring(from, endIndex).trim();
}

async function getSessionStorage(page, expectedKey = undefined) {
    const keysNow = await page.evaluate(() => {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        keys.push(sessionStorage.key(i));
      }
      return keys;
    });
    console.log("Current sessionStorage keys:", keysNow);

    if (expectedKey !== undefined) {
      await page.waitForFunction(
        (key) => sessionStorage.getItem(key) !== null,
        { timeout: 5000 },  // Set a shorter timeout for testing
        expectedKey
      );
    }

    const data = await page.evaluate(() => {
      const result = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        result[key] = sessionStorage.getItem(key);
      }
      return result;
    });

    return data;
  }

    async function getLocalStorage(page) {
        return await page.evaluate(() => {
          const data = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
          }
          return data;
        });
    }

    function getRandomInt() {
        return Math.floor(Math.random() * 100) + 10;
    }

    async function getComputedStyleProperty(page, locator, property) {
        const elementHandle = await locator.elementHandle();
        if (!elementHandle) throw new Error('Element not found for computed style');

        return await page.evaluate(({ el, prop }) => {
          return getComputedStyle(el)[prop];
        }, { el: elementHandle, prop: property });
    }

    async function getTextFromToast(page) {
        await page.waitForLoadState('domcontentloaded');
        const toastBox = page.locator(".Toastify__toast").first();
        await toastBox.waitFor(); // Ensures it's visible before extracting text
        const messageText = await toastBox.textContent();
        return messageText;
    }
      export default {
        extractBetween,
        getSessionStorage,
        getLocalStorage,
        getRandomInt,
        getComputedStyleProperty,
        getTextFromToast
      };

----------------------------------------------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////////////////////
///////////////// example of loginPageClass.js class  and logOutClass.js /////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

in the folder /page_classes/ I have 2 classes:
****************************************************************************
*******************   loginPageClass.js:
export class My_LogInPage {

    constructor(page, url) {
        this.pom_page = page;
        this.pom_url = url === undefined? 'https://freelance-learn-automation.vercel.app/login': url;
        this.pom_username = '#email1';
        this.pom_password = "//input[@id='password1']"; // can be '#password1' too!
        this.pom_btn_signIn = "button[type='submit']";
        this.pom_manage_button ="//span[normalize-space()='Manage']";
    }

    async logIntoApp(user, password) {
        await this.pom_page.goto(this.pom_url);
        await this.pom_page.waitForLoadState();
        // await this.pom_page.fill(this.pom_username, "admin@email.com"); //old , but supported
        // await this.pom_page.fill(this.pom_password, "admin@123");
        // await this.pom_page.click(this.pom_btn_signIn);
        if (user === undefined)     { user = "admin@email.com"; }
        if (password === undefined) { password = "admin@123";   }
        await this.pom_page.locator(this.pom_username).fill(user); // ✅ Use locator
        await this.pom_page.locator(this.pom_password).fill(password); // ✅ Use locator
        await this.pom_page.locator(this.pom_btn_signIn).click(); // ✅ Use locator
    }
    async getManageButton() {
        // await this.pom_page.locator(this.pom_manage_button).waitFor();
        return this.pom_page.locator(this.pom_manage_button);
    }
}


****************************************************************************
********************  and  logOutClass.js:
import { expect } from "playwright/test";

export class My_LogOutProfile {

    constructor(page) {
        this.pom_page = page;
        this.pom_header_text = "//h1[normalize-space()='Learn Automation Courses']";
        this.pom_menu_icon = "//img[@alt='menu']";
        this.pom_btn_signOut = "button[class='nav-menu-item']";
        this.pom_localStorage = '';
    }

    async checkHeader() {
        await this.pom_page.locator(this.pom_header_text).waitFor();
        return await this.pom_page.locator(this.pom_header_text).textContent();
    }

    async logOutProfile() {
        await this.pom_page.locator(this.pom_menu_icon).click();
        await this.pom_page.locator(this.pom_menu_icon).waitFor(); // wait's for appiarance
        await this.pom_page.locator(this.pom_btn_signOut).click();
    }

    async addToCart() {
        await this.pom_page.getByText('Add to Cart').first().click();
    }

    async checkCart_numberItems(number) {
        const cartButton = this.pom_page.locator('.cartBtn');
        if (number == 0) {
            await expect (this.pom_page.locator('.count')).toBeHidden();
        } else {
            if (await cartButton.isVisible()) { // ✅ Ensure the cart button is visible
                const countLocator = this.pom_page.locator('.count');
                // ✅ Wait for the element to be visible before getting text
                await countLocator.waitFor({ state: 'visible' });

                const numberOfItems = await countLocator.innerText();
                expect(numberOfItems.toString()).toBe(number.toString());
                expect(numberOfItems !== undefined && numberOfItems.toString() === number.toString()).toBe(true);
            } else {
                throw new Error("Cart button is not visible, cannot check item count");
            }
        }
    }

    async getValueOfLocalStorage(key) {
        this.pom_localStorage = await this.pom_page.evaluate((key) => {
            const value = localStorage.getItem(key);
            return value ? value.toString() : null;
        }, key);
        return this.pom_localStorage;
    }

    async getSpecificTagFromBody(keyInBody) {
        if (!this.pom_localStorage) {
            throw new Error("Local storage value is empty. Ensure it's fetched before calling this method.");
        }
        const body = JSON.parse(this.pom_localStorage);
        return body[keyInBody];
    }

    async removeItem() {
        await this.pom_page.getByRole('button', { name: 'Remove from Cart' }).click()
        expect (await this.pom_page.getByRole('button', { name: 'Remove from Cart' })).toBeVisible ;
    }
}



******************************************************************************
**********************  usage of classes in the tests/logOutFromClass.spec.js:
import { test, expect } from '@playwright/test';
import {My_LogInPage} from '../pages__classes/loginPageClass';
import {My_LogOutProfile} from '../pages__classes/logOutClass';

test('logingOut from usage of class', async ({ page }) => {
  //page instance instantiate URL inside of class, and returns as loginPage
  const loginPage = new My_LogInPage(page);
  await loginPage.logIntoApp("admin@email.com", "admin@123"); // Call the login method
  const manageButton = await loginPage.getManageButton();     // using returnable method from class
  expect (manageButton).toBeVisible();

  const logOut = new My_LogOutProfile(page);
  const headerText = await logOut.checkHeader()
  expect (headerText.includes("Automation Courses")).toBeTruthy();
  await logOut.logOutProfile()
  await expect(manageButton).toBeHidden();
  page.pause();
});



//////////////////////////////////////////////////////////////////////////////
//////////////////////////   example of fixtures  ////////////////////////////
//////////////////////////////////////////////////////////////////////////////
*******************in the folder /fixtures/ I have a file fixture_log_in.js:
import { test as baseTest } from '@playwright/test';
import { My_LogInPage } from '../pages__classes/loginPageClass'; // also it reuse My_LogInPage class

export const login_procedure = baseTest.extend({
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new My_LogInPage(page);
        await loginPage.logIntoApp();
        await use(loginPage); // ✅ Passes the instance of My_LogInPage to the test
    }
});


and this is example of usage class and fixture, in the test
******************** log_Out_classAndFixtures_localStorage.spec.js:
import { test, expect } from '@playwright/test'; // ✅ Import Playwright's default 'test' used in 1st case
import { login_procedure } from '../fixtures/fixture_log_in'; //    using in second case
import { My_LogInPage } from '../pages__classes/loginPageClass';
import { My_LogOutProfile } from '../pages__classes/logOutClass';

test('Logging out using class', async ({ page }) => {
    const loginPage = new My_LogInPage(page);
    await loginPage.logIntoApp("admin@email.com", "admin@123");

    const manageButton = await loginPage.getManageButton();
    await expect(manageButton).toBeVisible();

    const logOut = new My_LogOutProfile(page);
    const headerText = await logOut.checkHeader();
    expect(headerText.includes("Automation Courses")).toBeTruthy();

    await logOut.logOutProfile();
    await expect(manageButton).toBeHidden();
});

// ✅ Use login_procedure directly, and in the end, it return current PAGE
login_procedure('Add Item to the cart', async ({ authenticatedPage }) => {
    const manageButton = await authenticatedPage.getManageButton();
    await expect(manageButton).toBeVisible();
    await expect(manageButton.isVisible()).toBeTruthy();
    await expect(authenticatedPage.pom_page).toHaveURL(/freelance-learn-automation.vercel/);

    const profilePage = new My_LogOutProfile(authenticatedPage.pom_page);
    let cartValueFromLocalStorage = await profilePage.getValueOfLocalStorage("cart");
    // console.log("Before adding to the cart, expected 'null' cause 'cart' not been created " + cartValueFromLocalStorage);
    expect (cartValueFromLocalStorage === null);
    await profilePage.addToCart();
    await profilePage.checkCart_numberItems(1);

    const nameOfAddedBook = await profilePage.pom_page.locator('.name').first().innerText();
    console.log(" name been added: " + nameOfAddedBook)

    await profilePage.getValueOfLocalStorage("cart"); // now cart has '[..... description:"XXXX", .....]
    const valueFromLocalStorage = await profilePage.getSpecificTagFromBody('description');
    expect (nameOfAddedBook == valueFromLocalStorage).toBe(true) ;

    await profilePage.removeItem();
    await profilePage.checkCart_numberItems(0);
    await profilePage.logOutProfile();
    await expect(manageButton).toBeHidden();
});

   ****************************************************************************************************
   ****************************************************************************************************
   ****************************************************************************************************
   ***************************************** just javaScript ******************************************
   ****************************************************************************************************

    function fetchData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = "This text returned from fetchData() method after 2 sec";
                resolve(data); // Simulate successful data fetch
            }, 2000); // Simulating a delay of 2 seconds
        });
    }
    async function fetchAndPrintCrypto() {
        console.log("---------start method-----------");
        const response = await fetchData();
        console.log("Received from fetchData():", response);
        console.log("---------end method-----------");
    }
    fetchAndPrintCrypto();       /////////////////// usage without await
    console.log('{{{{{{}}}}}}')
    ===============================
    output:
    ---------start method-----------
    {{{{{{}}}}}}
    Received from fetchData(): This text returned from fetchData() method after 2 sec
    ---------end method-----------

    await fetchAndPrintCrypto(); /////////////////// usage with await
    output:
    ---------start method-----------
    Received from fetchData(): This text returned from fetchData() method after 2 sec
    ---------end method-----------
    {{{{{{}}}}}}


    import { randomBytes } from 'crypto';
    function fetchDataCrypto() {
        return new Promise((resolve, reject) => {
            randomBytes(16, (err, buffer) => {
                if (err) reject(err);
                resolve("Hello, this is your data: " + buffer.toString('hex'));
            });
        });
    }
    console.log("******* ", await fetchDataCrypto());



    console.log("----------------------------------------------------")
    let jsn = '{"name": "Vaca", "age": 20,"job": "teacher"}';
    let javaScritpObj = JSON.parse(jsn);
    console.log("whole jsn text: " + jsn);
    console.log("parsed values: " + javaScritpObj.name + " " + javaScritpObj.age + " " + javaScritpObj.job );
    console.log("whole javaScritpObj: " + javaScritpObj);
    console.log("----------------------------------------------------")

    output: --------------------------------------------
    whole jsn text: {"name": "Vaca", "age": 20,"job": "teacher"}
    parsed values: Vaca 20 teacher
    whole javaScritpObj: [object Object]
    ----------------------------------------------------


    function printUsers(data) {
        let jsonObj;
        if (typeof data === "string") { jsonObj = JSON.parse(data); }
        else if (typeof data === "object" && data !== null) {  jsonObj = data; }
        jsonObj.users.forEach(usr => {
            console.log("--user-- : " + usr.name + " " + usr.age + " "+usr.job)
        });
        return jsonObj;
    }
    let rawJsonText = '{"users":[{"name": "Vaca", "age": 20,"job": "teacher"}, {"name": "Ola", "age": 10,"job": "kid"}]}';
    let jsn = printUsers(rawJsonText);
    console.log("new Users array after adding one more User");
    const newUser =  { name:"Slava", age: 18, job: "living" }
    jsn.users.push(newUser);
    printUsers(jsn);

    output:
    --user-- : Vaca 20 teacher
    --user-- : Ola 10 kid
    new Users array after adding one more User
    --user-- : Vaca 20 teacher
    --user-- : Ola 10 kid
    --user-- : Slava 18 living

   ****************************************************************************************************
   ****************************************************************************************************
   ****************************************************************************************************
   ************** as of reminder, here is full Jenkins pipeline written in groovy script **************
   ****************************************************************************************************
   ******** do not forget to check Triggers->✅ GitHub hook trigger for GITScm polling  ***************
   ****************************************************************************************************


pipeline {
  agent any

  environment {
    PLAYWRIGHT_DIR = 'playwright-tests'
    WEBSITE_DIR = 'website'
    PLAYWRIGHT_REPORT_DIR = "$ {PLAYWRIGHT_DIR}/playwright-report"
  }

  stages {
    stage('Checkout Repositories') {
      steps {
        script {
          echo "Starting checkout of repositories..."

          dir("$ {WEBSITE_DIR}") {
            deleteDir()
            git credentialsId: 'd341b27a-4f01-4a48-aa84-d2cc2ce28cbc',
                url: 'https://github.com/oneFileSoft/testing_box_site.git',
                branch: 'main'
            echo "*************** Website repository checked out successfully ***************"
          }

          dir("$ {PLAYWRIGHT_DIR}") {
            deleteDir()
            git credentialsId: 'd341b27a-4f01-4a48-aa84-d2cc2ce28cbc',
                url: 'https://github.com/oneFileSoft/testing_box_playwright.git',
                branch: 'main'
            echo "*************** Playwright repository checked out successfully ***************"
          }
        }
      }
    }

    stage('Create DB Config File') {
      environment {
        DB_CREDENTIALS = credentials('db-password')
      }
      steps {
        script {
          echo "Creating db.js file with injected credentials..."
          dir("$ {WEBSITE_DIR}/config") {
            writeFile file: 'db.js', text: """
              const mysql = require('mysql2');

              const pool = mysql.createPool({
                host: 'localhost',
                user: '$ {DB_CREDENTIALS_USR}',
                password: '$ {DB_CREDENTIALS_PSW}',
                database: 'test_DB',
                port: '3306',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                timezone: "Z"
              });

              console.log("Database connection pool initialized.");
              module.exports = pool.promise();
            """.stripIndent()

            echo "*************** config/db.js created with pool.promise()! ***************"
          }
        }
      }
    }

    stage('Recreate Database and Seed Data') {
      steps {
        script {
          sh '''#!/bin/bash
            sudo systemctl start mysql || {
              echo "XXXXX  Failed to start MySQL. XXXXX"
              exit 1
            }

            sudo systemctl enable mysql

            mysql -u test -p'test' -h localhost -e "
              DROP DATABASE IF EXISTS test_DB;
              CREATE DATABASE test_DB;
              USE test_DB;

              CREATE USER IF NOT EXISTS 'test'@'localhost' IDENTIFIED BY 'test';
              GRANT ALL PRIVILEGES ON *.* TO 'test'@'localhost' WITH GRANT OPTION;
              FLUSH PRIVILEGES;

              CREATE TABLE expenses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                transDescr VARCHAR(2000) NOT NULL,
                transDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                transTotal FLOAT NOT NULL DEFAULT 0
              );

              INSERT INTO expenses (userId, transDescr, transDate, transTotal) VALUES
                (45, 'descriptions 1 for John', '2025-03-27 04:00:00', 2),
                (45, 'descriptions 2 for John', '2025-02-04 05:00:00', 1),
                (46, 'descriptions 1 for Test', '2025-03-01 05:00:00', 5),
                (46, 'descriptions 2 for Test', '2025-01-30 05:00:00', 80);

              CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                uName VARCHAR(500) NOT NULL,
                uPass TEXT NOT NULL,
                role VARCHAR(12) DEFAULT NULL,
                created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              );

              INSERT INTO users (id, uName, uPass, role, created) VALUES
                (45, 'JohhuEU6a43b+vGfqgh4j9uhK6ma9pLiTgMRTWfyimTjc3DTPi/AvhJtQeUtYNfl6e8+ulXfnZmv7JIU0c0M4OlRw==',
                 'huEU6a43b+vGfqgh4j9uhK6ma9pLiTgMRTWfyimTjc3DTPi/AvhJtQeUtYNfl6e8+ulXfnZmv7JIU0c0M4OlRw==',
                 NULL, '2025-03-28'),
                (46, 'tesHED4y0/6Y1yhY84ldcL/8Kwj1DZ8v8iuJwXPpCGj13dy2PcdmjYceT4AtvT17+jCPvK8IMg3aCEPPNHVZq9ygA==',
                 'HED4y0/6Y1yhY84ldcL/8Kwj1DZ8v8iuJwXPpCGj13dy2PcdmjYceT4AtvT17+jCPvK8IMg3aCEPPNHVZq9ygA==',
                 NULL, '2025-03-28');
            "
            echo "*************** Database recreated and seeded ***************"
          '''
        }
      }
    }

    stage('Start Website on Jenkins Host') {
      steps {
        script {
          dir("$ {WEBSITE_DIR}") {
            sh '''
              cd frontend
              npm install
              npm run build
              cd ../

              npm install
              nohup node server.js > jenkins-local-server.log 2>&1 &
              SERVER_PID=$!

              echo "Waiting for server startup for 10 sec..."
              for i in {1..10}; do
                sleep 1
                if curl -s http://localhost:3000 > /dev/null; then
                  echo "*************** Server started - http://localhost:3000 ***************"
                  break
                else
                  echo "Starting..."
                fi
              done
              if ! curl -s http://localhost:3000 > /dev/null; then
                echo "XXXXX Server did NOT start, terminating: $SERVER_PID  XXXXX"
                kill $SERVER_PID
                exit 1
              fi
            '''
          }
        }
      }
    }

    stage('Install Playwright Dependencies') {
      steps {
        script {
          dir("$ {PLAYWRIGHT_DIR}") {
            sh '''
              npm install --save-dev @playwright/test
              npx playwright install
              if command -v apt-get > /dev/null; then
                npx playwright install-deps || true
              fi
              echo "*************** Playwright dependencies updated ***************"
            '''
          }
        }
      }
    }

    stage('Run Playwright Regression') {
      steps {
        script {
          dir("$ {PLAYWRIGHT_DIR}") {

            def sendReport = {
              def reportFile = "playwright-report/index.html"
              def fallbackMessage = "*** No regression run: see build stack trace for more details"

              sleep 5 // ensure file system has flushed report
//in FSO... of hosting where API report-api-email is:
// for future receiving big data from Jenkins job (consoleLog and playwright regr report in html)
//         in folder public_html/  edit .htaccess file and add following lines:
//                   <IfModule mod_security.c>
//                      SecRequestBodyLimit 52428800
//                  </IfModule>
//                  LimitRequestBody 52428800
              if (fileExists(reportFile)) {
                echo "✅ Playwright report found at: $ {reportFile}"
                sleep 5
                sh """
                  curl -X POST https://testingbox.pw/report-api-email \\
                    -F "format=0" \\
                    -F "emailTo=i_slava_i@yahoo.com" \\
                    -F "buildNumb=$ {env.BUILD_ID}" \\
                    -F "attachment=@$ {reportFile};type=text/html"
                """
              } else {
                echo "❌ No report file found at $ {reportFile}"
                def payload = [
                  format: "1",
                  emailTo: "i_slava_i@yahoo.com",
                  message: fallbackMessage,
                  buildNumb: "$ {env.BUILD_ID}"
                ]
                def emailPayload = groovy.json.JsonOutput.toJson(payload)
                writeFile file: 'payload.json', text: emailPayload
                sh 'curl -X POST https://testingbox.pw/report-api-email -H "Content-Type: application/json" --data @payload.json'
              }
            }

            try {
              sh '''
                export BASE_URL=http://localhost:3000
                npx playwright test --reporter=html
                echo "✅ Playwright regression completed"
              '''
              sendReport()
            } catch (e) {
              currentBuild.result = 'FAILURE'
              echo "❌ Regression tests failed!"
              sendReport()
              error("Aborting build due to regression failure.")
            }
          }
        }
      }
    }

    stage('Archive Playwright HTML Report') {
      steps {
        script {
          sh "ls -l $ {PLAYWRIGHT_REPORT_DIR} || true"
          archiveArtifacts artifacts: "$ {PLAYWRIGHT_REPORT_DIR}/**", fingerprint: true
        }
      }
    }

    stage('Deploy Website') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        echo "Deploying website..."
        sshagent(credentials: ['814f276d-73a0-4fc7-b881-11ddd342b024']) {
          sh '''
            ssh -o StrictHostKeyChecking=no -p 21098 hogwqmidfzju@198.54.114.242 '
              source ~/.bash_profile && deployMyBuild
            '
          '''
          echo "******** New version of WebSite been deployed ********"
          echo "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅"
        }
      }
    }
  }

  post {
    always {
      script {
        echo "Collecting console output for report API..."

        def gzip = { String input ->
          def byteStream = new java.io.ByteArrayOutputStream()
          def gzipStream = new java.util.zip.GZIPOutputStream(byteStream)
          gzipStream.write(input.getBytes("UTF-8"))
          gzipStream.close()
          return byteStream.toByteArray()
        }

        def encode64 = { byte[] inputBytes ->
          return inputBytes.encodeBase64().toString()
        }

        withCredentials([usernamePassword(credentialsId: 'credentialId_ForFetchingConsoleLog', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
          def consoleLog = sh(
            script: "curl -s --user \"$ USERNAME:$ PASSWORD\" \"$ {env.BUILD_URL}consoleText\"",
            returnStdout: true
          ).trim()
          echo "✅ Raw console log size: $ { consoleLog.length()} bytes"
          def escapedLog = "Build# $ {env.BUILD_ID} " + consoleLog
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "")
            .replace("[Pipeline] }", "")
            .replace("[Pipeline] // dir", "")
            .replace("[Pipeline] // script", "")
            .replace("[Pipeline] // stage", "")
            .replace("[Pipeline] stage", "")
            .replace("[Pipeline] script", "")
            .replace("[Pipeline] {", "")
            .replace("[Pipeline] dir", "")
            .replace("[Pipeline] echo", "")
          def gzippedConsoleLog = gzip(escapedLog)
          def encodedConsoleLog = encode64(gzippedConsoleLog)
          echo "✅ Gzipped+Base64 ConsoleLog size: $ {encodedConsoleLog.length()} chars"

          def htmlReportPath = "$ {env.PLAYWRIGHT_REPORT_DIR}/index.html"
          def encodedHtmlContent = ""
          if (fileExists(htmlReportPath)) {
            def htmlContent = readFile(file: htmlReportPath)
            echo "✅ Raw HTML report size: $ {htmlContent.length()} bytes"
            def gzippedHtmlContent = gzip(htmlContent)
            encodedHtmlContent = encode64(gzippedHtmlContent)
          }  else {
            encodedHtmlContent = encode64(gzip("<html>Regression was skipped...</html>"))
          }
          echo "✅ Gzipped+Base64 HTML size: $ {encodedHtmlContent.length()} chars"

          def theStatus = (currentBuild.result == null || currentBuild.result == 'SUCCESS')
          def jsonPayload = """
            {
              "buildId": "$ {env.BUILD_ID}",
              "status": $ {theStatus},
              "html": "$ {encodedHtmlContent}",
              "consol": "$ {encodedConsoleLog}"
            }
          """
          httpRequest(
            httpMode: 'POST',
            url: 'https://testingbox.pw/api/insertRegrReport',
            contentType: 'APPLICATION_JSON',
            requestBody: jsonPayload
          )
          echo "*************** Build report sent to API ***************"
        }
        sh "pkill -f 'node server.js' || true"
        sh "rm -rf $ {PLAYWRIGHT_DIR}/node_modules $ {WEBSITE_DIR}/node_modules"
        sh "rm -rf $ {PLAYWRIGHT_REPORT_DIR}"
        echo "*************** Cleaned up environment ***************"
      }
    }
  }
}

  `
];
export default details;