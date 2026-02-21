import { prisma } from "../config/prisma";
import Api, { apiError } from "../utils/apiRes.util";

export const createUser = async (req: any, res: any, next: any) => {
  try {
    const { fullName, email, password, desc, role } = req.body;
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        desc,
        role,
      } as any,
    });

    const { password: _, ...userWithoutPassword } = user;
    return Api.success(res, userWithoutPassword, "User created successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to create user", [error?.message || String(error)], error?.stack));
  }
};

export const loginUser = async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return next(new apiError(401, "Invalid email or password"));
    }

    const { password: _, ...userWithoutPassword } = user;
    return Api.success(res, userWithoutPassword, "Login successful");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Internal Server Error", [error?.message || String(error)], error?.stack));
  }
};

export const getAllUsers = async (req: any, res: any, next: any) => {
  try {
    const users = await prisma.user.findMany();
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
    return Api.success(res, usersWithoutPassword, "Users fetched successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to fetch users", [error?.message || String(error)], error?.stack));
  }
};

export const deleteUser = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return next(new apiError(404, "User not found"));

    await prisma.user.delete({ where: { id } });
    return Api.success(res, null, "User deleted successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to delete user", [error?.message || String(error)], error?.stack));
  }
};

export const deleteAllUsers = async (req: any, res: any, next: any) => {
  try {
    const result = await prisma.user.deleteMany({});
    return Api.success(res, { deletedCount: result.count }, "All users deleted");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to delete users", [error?.message || String(error)], error?.stack));
  }
};



