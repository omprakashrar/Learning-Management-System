import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', 
  port: 587,
  secure: false, 
  auth: {
    user: 'your_email@example.com', 
    pass: 'your_email_password', 
},
});

// Define the email content
const mailOptions = {
  from: 'your_email@example.com', // Sender address
  to: 'recipient@example.com', // List of recipients (can be an array for multiple recipients)
  subject: 'Test Email from Nodemailer', // Subject line
  text: 'Hello from Nodemailer!', // Plain text body
  html: '<p>Hello from <b>Omprakash</b>!</p>', // HTML body (optional)
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
