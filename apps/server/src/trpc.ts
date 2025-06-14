import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { ZodError } from "zod";

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Base router and procedure
export const router = t.router;
export const publicProcedure = t.procedure;

// Auth middleware
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // now guaranteed to be non-null
    },
  });
});

// Protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// Permission-based middleware
export const hasPermission = (resource: string, action: string) =>
  t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    // Check if user has the required permission
    const hasRequiredPermission = ctx.user.roles.some((userRole) =>
      userRole.role.permissions.some(
        (rolePermission) =>
          rolePermission.permission.resource === resource &&
          rolePermission.permission.action === action
      )
    );

    if (!hasRequiredPermission) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Permission denied: ${action} on ${resource}`,
      });
    }

    return next({ ctx });
  });

// Permission-based procedure
export const permissionProcedure = (resource: string, action: string) =>
  protectedProcedure.use(hasPermission(resource, action));
