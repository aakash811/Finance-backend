import { Request } from 'express';
interface AuditParams {
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: Record<string, unknown>;
    success?: boolean;
    errorMessage?: string;
    req?: Request;
}
export declare const audit: (params: AuditParams) => Promise<void>;
export {};
