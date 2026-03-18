import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../../config/env";

export type TokenPayload = {
    sub: string;
    role: Role;
    email: string;
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export const signAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
    });
};
