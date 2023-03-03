const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "its.me.om.k@gmail.com",
    pass: "uicrmhazpqcytzqd",
  },
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `${process.env.APP_URL}`); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Send email to your email address with the form data
    const messageBody = `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `;
    const emailOptions = {
      from: "its.me.om.k@gmail.com",
      to: "its.me.om.k@gmail.com",
      subject: "New message from contact form",
      text: messageBody,
    };
    await transporter.sendMail(emailOptions);

    // Send confirmation email to the visitor's email address
    const confirmationMessageBody = `
    Dear ${name},
    
    Thank you for contacting me through my contact form. I appreciate your interest in my work and the time you took to write to me. 
    If you have any specific questions or concerns that you'd like me to address, please feel free to reply to this email.

    In any case, I'm glad you took the time to write to me and will try to get in contact with you as soon as possible.
    If there's anything else I can do to assist you, please don't hesitate to let me know.

    Thank you again for your message. I look forward to speaking with you soon.

    Best regards,
    Om Kamble    
    `;
    const confirmationEmailOptions = {
      from: "its.me.om.k@gmail.com",
      to: email,
      subject: "Thanks for reaching out 🙌",
      text: confirmationMessageBody,
    };
    await transporter.sendMail(confirmationEmailOptions);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
