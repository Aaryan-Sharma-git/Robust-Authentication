import resend from '../config/resend.js';
import { EMAIL_SENDER, NODE_ENV } from '../constants/env.js';

type params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const sendEmail = async ({ to, subject, text, html }: params) => {
  const TO_EMAIL = NODE_ENV === 'development' ? 'delivered@resend.dev' : to;
  const FROM_EMAIL = NODE_ENV === 'development' ? 'onboarding@resend.dev' : EMAIL_SENDER;

  return await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject,
    html,
    text,
  });
};

export { sendEmail };
