const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;;

const corsOptions = {
    origin: '*', // Allow all origins (for testing, replace in production)
    methods: ['GET', 'POST', "DELETE"],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
//following increase limit size for the incoming data, for example from Jenkins (consolLog and html-regr-result)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/version-check', (req, res) => {
  res.json({ version: "1.2.3", time: new Date().toISOString() });
});


const loginRoute = require('./routes/login');
app.use('/', loginRoute);

const insertRoute = require('./routes/insert');
app.use('/', insertRoute);

const insertExpense = require('./routes/insertExpense');
app.use('/', insertExpense);

const getExpenses = require('./routes/getExpenses');
app.use('/', getExpenses);

const deleteExpense = require('./routes/deleteExpense');
app.use('/', deleteExpense);

const getAllUsers = require('./routes/getAllUsers');
app.use('/', getAllUsers);

const transactions = require('./routes/transactions');
app.use('/', transactions);

const insertBuildReport = require('./routes/insertBuildReport');
app.use('/api', insertBuildReport);

const getBuildRecords = require('./routes/getBuildRecords');
app.use('/api', getBuildRecords);

const insertRegrReport = require('./routes/insertRegrReport');
app.use('/api', insertRegrReport);

const getRegrRecords = require('./routes/getRegrRecords');
app.use('/api', getRegrRecords);

app.post('/report-email', async (req, res) => {
  const { format, emailTo, message, buildNumb } = req.body;

  if (!format && format !== 0 || !emailTo || !message || !buildNumb) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: 'testingbox.pw',
      port: 465,
      secure: true,
      auth: {
        user: 'test@testingbox.pw',
        pass: 'zdr6^$rfv'
      }
    });

//    let mailOptions = {
//      from: 'test@testingbox.pw',
//      to: emailTo,
//      subject: `Build#${buildNumb} - RegressionReport`,
//      ...(format === 0 ? { html: message } : { text: message }),
//    };
    let mailOptions = {
      from: 'test@testingbox.pw',
      to: emailTo,
      subject: `Build#${buildNumb} - RegressionReport`,
      text: "Attached is the latest Playwright regression report.",
      attachments: [
        {
          filename: `PlaywrightReport_Build${buildNumb}.html`,
          content: message,
          contentType: 'text/html'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.response.toLowerCase().includes("ok")) {
      console.log("Email sent: " + info.response);
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      console.warn("SMTP response but not OK: ", info.response);
      return res.status(502).json({ success: false, message: 'Failed to send email: ' + info.response });
    }

  } catch (error) {
    console.error("Error sending email: ", error);

    // Try to categorize error
    const errorMessage = error?.message || '';
    if (errorMessage.includes('Invalid login')) {
      return res.status(401).json({ success: false, message: 'Authentication failed. Check SMTP credentials.' });
    } else if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNECTION')) {
      return res.status(503).json({ success: false, message: 'Unable to connect to SMTP server.' });
    } else if (errorMessage.includes('Invalid recipient')) {
      return res.status(400).json({ success: false, message: 'Invalid recipient address.' });
    }

    // Fallback: Internal error
    return res.status(500).json({ success: false, message: 'Internal error: ' + errorMessage });
  }
});





app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: 'testingbox.pw',
      port: 465,
      secure: true,
      service: 'namecheap',
      auth: { user: 'test@testingbox.pw', pass: 'zdr6^$rfv' }
    });

    let info = await transporter.sendMail({
      from: 'test@testingbox.pw',
      to: email,
      subject: `From ${name} to ${email}`,
      text: message,
    });

    if (info.response.includes("OK")) {
      console.log("Email have been sent successfully: " + info.response);
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    } else {
      console.log("Email not sent: " + info.response);
      return res.status(500).json({ success: false, message: 'Error sending email. ' + info.response});
    }

  } catch (error) {
    console.error("Error sending email: ", error);
    return res.status(500).json({ success: false, message: 'Error sending email. ' + error });
  }
});



app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch-all (* or regex) routes should always be last.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});


// Start the server
//app.listen(port,  () => {
//  console.log(`Server running at http://${host}:${port}`);
//});
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});



