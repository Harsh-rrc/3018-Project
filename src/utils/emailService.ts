import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  // Check if SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[emailService] SMTP credentials not configured. Skipping email send.');
    console.log(`[emailService] Would send email to: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    const mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await mailer.sendMail({
      from: `"${process.env.FROM_NAME || 'Loan Service'}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log('[emailService] Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('[emailService] Failed to send email:', error);
    throw error;
  }
}
