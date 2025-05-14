const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');

const upload = multer(); // memoryStorage is default
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


//    let mailOptions = {
//      from: 'test@testingbox.pw',
//      to: emailTo,
//      subject: `Build#${buildNumb} - RegressionReport`,
//      ...(format === 0 ? { html: message } : { text: message }),
//    };



app.post('/report-api-email', upload.single('attachment'), async (req, res) => {
  const { format, emailTo, buildNumb, subject } = req.body;
  const attachmentFile = req.file;

  if ((!format && format !== "0") || !emailTo || !buildNumb) {
    return res.status(400).json({
      success: false,
      message: `All fields are required: format[${format}] emailTo[${emailTo}] buildNumb[${buildNumb}]`
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com',
      port: 465,
      secure: true,
      service: 'namecheap',
      auth: {
        user: 'test@testingbox.pw',
        pass: 'zdr6^$rfv'
      }
    });

    await transporter.verify();

    const mailOptions = {
      from: 'test@testingbox.pw',
      to: emailTo,
      subject: subject || `Build#${buildNumb} - RegressionReport`,
      text: 'Attached is the latest regression report.',
      date: new Date(), // Force mail header to current time
      attachments: []
    };

    if (format === "0" && attachmentFile) {
      mailOptions.attachments.push({
        filename: attachmentFile.originalname || `Report_Build${buildNumb}.html`,
        content: attachmentFile.buffer,
        contentType: attachmentFile.mimetype || 'text/html'
      });
    } else {
      mailOptions.text = req.body.message || mailOptions.text;
    }

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      mailInfo: info
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: 'Error: ' + error.message
    });
  }
});
// not sure why but this workd one, and the it stop
//app.post('/report-email', upload.single('attachment'), async (req, res) => {
//  const { format, emailTo, buildNumb } = req.body;
//  const attachmentFile = req.file;
//
//  if ((!format && format !== "0") || !emailTo || !buildNumb) {
//    return res.status(400).json({
//      success: false,
//      message: `All fields are required got format[${format}] emailTo[${emailTo}] buildNumb[${buildNumb}]`
//    });
//  }
//
//  try {
//    let transporter = nodemailer.createTransport({
//      host: 'testingbox.pw',
//      port: 465,
//      secure: true,
//      auth: {
//        user: 'test@testingbox.pw',
//        pass: 'zdr6^$rfv'
//      }
//    });
//
//    await transporter.verify();
//
//    let mailOptions = {
//      from: 'test@testingbox.pw',
//      to: emailTo,
//      subject: `Build#${buildNumb} - RegressionReport`,
//      text: "Attached is the latest Playwright regression report.",
//      attachments: []
//    };
//
//    if (format === "0" && attachmentFile) {
//      mailOptions.attachments.push({
//        filename: `PlaywrightReport_Build${buildNumb}.html`,
//        content: attachmentFile.buffer,
//        contentType: attachmentFile.mimetype
//      });
//    } else {
//      mailOptions.text = req.body.message || mailOptions.text;
//    }
//
//    const info = await transporter.sendMail(mailOptions);
//    console.log('Email send result:', info);
//
//    return res.status(200).json({
//      success: true,
//      message: 'Email sent successfully',
//      mailInfo: info
//    });
//
//  } catch (error) {
//    console.error("Error sending email: ", error);
//    return res.status(500).json({ success: false, message: 'Error: ' + error.message });
//  }
//});




app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com',
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

    return res.status(200).json({
          success: true,
          message: 'Email sent successfully',
          messageId: info.messageId,
          accepted: info.accepted,
          response: info.response
        });

  } catch (error) {
    console.error("Error sending email: ", error);
    return res.status(500).json({
          success: false,
          message: 'Failed to send email.',
          error: {
            message: error.message,
            code: error.code || null,
            response: error.response || null,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          }
        });
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



