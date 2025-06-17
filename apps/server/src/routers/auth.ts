// server/src/routers/auth.ts
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';

export const authRouter = router({
  // Login
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      // Find user with company and branch
      const user = await ctx.prisma.user.findUnique({
        where: { email },
        include: {
          company: true,
          branch: true,
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      if (!user.isActive) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Account is deactivated',
        });
      }

      if (!user.company.isActive) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Company account is deactivated',
        });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        companyId: user.companyId,
        branchId: user.branchId || undefined,
      });

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
        message: 'Login successful',
      };
    }),

  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const { password: _, ...userWithoutPassword } = ctx.user;
    return userWithoutPassword;
  }),

  // Change password
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, newPassword } = input;

      // Get current user
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect',
        });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { password: hashedNewPassword },
      });

      return { message: 'Password changed successfully' };
    }),

  // Update profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required').optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          ...input,
          updatedAt: new Date(),
        },
        include: {
          company: true,
          branch: true,
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }),

  // Logout (client-side token removal, but we can log it)
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    // Here you could add audit logging if needed
    return { message: 'Logged out successfully' };
  }),
});