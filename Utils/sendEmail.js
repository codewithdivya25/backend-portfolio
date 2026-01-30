import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  
  const info = await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  });

  
  console.log("Email sent:", info.messageId);
};

export default sendEmail;
