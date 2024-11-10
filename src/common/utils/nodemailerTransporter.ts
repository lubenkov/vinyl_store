import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const gmailSender = process.env.GMAIL_SENDER;
const gmailPass = process.env.GMAIL_PASS;

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: gmailSender,
        pass: gmailPass,
    },
});
