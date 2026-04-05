import { Request } from 'express';
export declare enum Role {
    VIEWER = "VIEWER",
    ANALYST = "ANALYST",
    ADMIN = "ADMIN"
}
export declare enum RecordType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export interface JwtPayload {
    userId: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface RecordFilters {
    type?: RecordType;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: unknown;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
