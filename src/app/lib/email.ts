import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to: string, subject: string, htmlContent: string, ) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: htmlContent,
  
  };

  await transporter.sendMail(mailOptions);
}