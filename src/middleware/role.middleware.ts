import { Response, NextFunction } from 'express';
import { AuthRequest, Role } from '../types';
import { AppError } from '../utils/appError';

const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.VIEWER]: 1,
  [Role.ANALYST]: 2,
  [Role.ADMIN]: 3,
};

export const requireRole = (...roles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError('Unauthorized', 401));
    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = Math.min(...roles.map((r) => ROLE_HIERARCHY[r]));
    if (userLevel < requiredLevel) {
      return next(new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403));
    }
    next();
  };

export const requireAdmin = requireRole(Role.ADMIN);
export const requireAnalyst = requireRole(Role.ANALYST, Role.ADMIN);
export const requireViewer = requireRole(Role.VIEWER, Role.ANALYST, Role.ADMIN);