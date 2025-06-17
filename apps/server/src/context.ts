// server/src/context.ts
import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { prisma } from "./utils/prisma";

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  // Extract token from Authorization header
  const getUser = async () => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        companyId: string;
        branchId?: string;
      };

      // Get user with company and branch info
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          isActive: true,
          company: {
            isActive: true,
          },
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
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.company || !user.isActive) return null;

      return user;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return null;
    }
  };

  const user = await getUser();

  return {
    req,
    res,
    prisma,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
