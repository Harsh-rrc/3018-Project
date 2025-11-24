import nodemailer from 'nodemailer';
import { mailer } from '../config/mailer';

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  try {
    const info = await mailer.sendMail({
      from: '"Loan Service" <unique.wiegand@ethereal.email>',
      to,
      subject,
      text,
    });
    console.log('Email sent:', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL:', previewUrl);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
