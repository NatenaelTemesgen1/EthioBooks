import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `${env.FRONTEND_ORIGIN}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"EthioBooks" <${env.EMAIL_USER}>`,
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, ignore this email.</p>
      <p>This link expires in 1 hour.</p>
    `,
  });
}