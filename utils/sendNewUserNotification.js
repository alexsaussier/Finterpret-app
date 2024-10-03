import { sendEmail } from '@/libs/mailgun';
import config from '@/config';

export async function sendNewUserNotification(user) {
  const subject = 'New User Registration';
  const text = `A new user has registered:\n\nName: ${user.name}\nEmail: ${user.email}\nID: ${user._id}`;

  console.log('Attempting to send new user notification to', config.mailgun.supportEmail);

  try {
    await sendEmail({
      to: config.mailgun.supportEmail,
      subject,
      text,
    });
    console.log('New user notification sent successfully');
  } catch (error) {
    console.error('Failed to send new user notification:', error);
    // Log more details about the error
    if (error.response) {
      console.error('Mailgun API response:', error.response.body);
    }
    throw error; // Re-throw the error so it's not silently caught
  }
}
