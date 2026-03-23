import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { ApiError } from '../utils/ApiError';
import type { JwtPayload } from '../middlewares/auth';
import { sendPasswordResetEmail } from '../utils/email';

const SALT_ROUNDS = 10;

export async function register(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError('Email already registered', 400);

  const userRole = await prisma.role.findFirst({ where: { name: 'user' } });
  if (!userRole) throw new ApiError('Roles not seeded', 500);

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, roleId: userRole.id },
    include: { role: true },
  });

  const token = signToken(user.id, user.email, user.roleId, user.role.name);
  return {
    user: toUserResponse(user),
    token,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) throw new ApiError('Invalid email or password', 401);

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError('Invalid email or password', 401);

  const token = signToken(user.id, user.email, user.roleId, user.role.name);
  return {
    user: toUserResponse(user),
    token,
  };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: true }; // No token returned
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  try {
    await sendPasswordResetEmail(email, rawToken);
  } catch (err) {
    console.error('Failed to send reset email:', err);
  }

  // In production, never return the token. Only return success.
  return { success: true };
}
export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const now = new Date();

  const rec = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    include: { user: true },
  });

  if (!rec) throw new ApiError('Invalid or expired reset token', 400);

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: rec.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.update({
      where: { id: rec.id },
      data: { usedAt: now },
    }),
  ]);
}

function signToken(userId: string, email: string, roleId: string, role: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return jwt.sign(
    { userId, email, roleId, role } as JwtPayload,
    secret,
    { expiresIn: '7d' }
  );
}

function toUserResponse(user: { id: string; name: string; email: string; avatar: string | null; role: { name: string }; createdAt: Date }) {
  const reviewCount = 0;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? '',
    role: user.role.name as 'admin' | 'user',
    reviewCount,
    favoriteBooks: [] as string[],
    joinedAt: user.createdAt.toISOString().split('T')[0],
  };
}