const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    if (!process.env.BREVO_SMTP_USER) {
        console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
        return;
    }
    const mailOptions = {
        from: process.env.EMAIL || 'no-reply@ecommerce.com',
        to,
        subject,
        html
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
