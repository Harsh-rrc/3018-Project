import { sendEmail } from '../src/utils/emailService';

export async function test() {
  try {
    await sendEmail(' unique.wiegand@ethereal.email', 'Test Email from Loan App', 'This is a test email to verify nodemailer configuration.');
    console.log('Test email sent successfully. Check your inbox.');
  } catch (err) {
    console.error('Error sending test email:', err);
  }
}

test();