import nodemailer from 'nodemailer';

const isTestEnv = process.env.NODE_ENV === 'test' || (typeof jest !== 'undefined');

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const service = process.env.EMAIL_SERVICE || 'gmail';

    // If no credentials, do a safe no-op with logging (so API doesn't fail)
    if (!user || !pass) {
      if (!isTestEnv) {
        console.info(`[emailService] Credentials not set. Would send to: ${to} | subject: ${subject}`);
      }
      return;
    }

    const transporter = nodemailer.createTransport({
      service,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: user,
      to,
      subject,
      text
    });

    if (!isTestEnv) {
      console.info(`[emailService] Email sent to ${to}`);
    }
  } catch (err) {
    // Log errors, but do not rethrow — keep API flow stable.
    if (!isTestEnv) {
      console.error('[emailService] sendEmail error:', (err as Error).message || err);
    }
  }
}
