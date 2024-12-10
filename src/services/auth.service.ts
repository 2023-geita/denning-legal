import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export class AuthService {
  static async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.ATTORNEY,
        active: true,
      },
    });
  }

  static async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user || !user.active) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password || '');
    if (!isValid) {
      return null;
    }

    return user;
  }

  static async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  static async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  static async updateProfile(userId: string, data: {
    name?: string;
    phoneNumber?: string;
    position?: string;
    department?: string;
    avatar?: string;
    bio?: string;
  }) {
    const { name, ...profileData } = data;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name: name || undefined },
      }),
      prisma.userProfile.upsert({
        where: { userId },
        create: { userId, ...profileData },
        update: profileData,
      }),
    ]);
  }
} 