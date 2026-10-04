import { Resend } from 'resend';
import { env } from './src/config/env.js';

const resend = new Resend(env.RESEND_API_KEY);

async function testEmail() {
  console.log('Sending email with key:', env.RESEND_API_KEY.substring(0, 8) + '...');
  console.log('From:', env.MAIL_FROM);
  
  const response = await resend.emails.send({
    from: env.MAIL_FROM,
    to: [env.VENDOR_EMAIL],
    subject: 'Test Email',
    html: '<p>Test email</p>'
  });
  
  console.log('Response:', response);
}

testEmail().catch(console.error);
