const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `SmartTask <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    if (process.env.EMAIL_USER === 'dummy_email') {
        console.log(`[MOCK EMAIL] To: ${options.email}, Subject: ${options.subject}, Message: ${options.message}`);
        return;
    }
    
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Email send error:', err);
    }
};

module.exports = sendEmail;
