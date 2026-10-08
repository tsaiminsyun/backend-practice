import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

type AuthPayload = {
  userId: number;
};

function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "1d",
  });
}

export async function registerUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(409, "email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });

  const token = signToken({
    userId: user.id,
  });

  return {
    user,
    token,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(401, "invaild email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, "invaild email or password");
  }

  const token = signToken({
    userId: user.id,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
