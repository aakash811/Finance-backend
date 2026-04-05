import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
export declare const usersController: {
    list(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    create(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    update(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
};
