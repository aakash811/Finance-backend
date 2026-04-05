import mongoose, { Document } from 'mongoose';
export interface IAuditLog extends Document {
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    errorMessage?: string;
    createdAt: Date;
}
export declare const AuditLog: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
