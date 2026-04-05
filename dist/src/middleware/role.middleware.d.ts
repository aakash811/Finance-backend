import { Response, NextFunction } from 'express';
import { AuthRequest, Role } from '../types';
export declare const requireRole: (...roles: Role[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const requireAnalyst: (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const requireViewer: (req: AuthRequest, _res: Response, next: NextFunction) => void;
