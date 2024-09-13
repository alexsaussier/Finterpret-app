import { sendEmail } from '@/libs/mailgun';
import config from '@/config';

export async function sendNewUserNotification(user) {
  const subject = 'New User Registration';
  const text = `A new user has registered:\n\nName: ${user.name}\nEmail: ${user.email}\nID: ${user._id}`;

  await sendEmail({
    to: config.mailgun.supportEmail,
    subject,
    text,
  });
}
