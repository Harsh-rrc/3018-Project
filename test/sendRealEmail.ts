import { sendEmail } from '../src/utils/emailService';

async function testEmail() {
  console.log('Testing email functionality...');

  try {
    await sendEmail(
      'test@example.com',
      'Test Email from Loan Service',
      'This is a test email to verify SMTP configuration is working.'
    );
    console.log(' Email sent successfully!');
  } catch (error) {
    console.error(' Email failed:', error);
  }
}

testEmail();
