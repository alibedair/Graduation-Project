const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendOTPEmail = async (email, otpCode, userName = 'User') => {
    try {
        const mailOptions = {
            from: `"Craftopia" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Email Verification - Craftopia',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; text-align: center;">Welcome to Craftopia!</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for registering on Craftopia. To complete your registration, please verify your email address using the OTP code below:</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
                    </div>
                    
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>This OTP is valid for 10 minutes only</li>
                        <li>Do not share this code with anyone</li>
                        <li>If you didn't request this, please ignore this email</li>
                    </ul>
                    
                    <p>Best regards,<br>The Craftopia Team</p>
                    
                    <hr style="margin-top: 30px;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        
        if (error.code === 'EAUTH') {
            console.log('🚨 Gmail Authentication Error: Please use App Password instead of regular password');
        }
        
        return false;
    }
};

module.exports = { sendOTPEmail };
