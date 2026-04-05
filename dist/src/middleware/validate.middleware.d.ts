import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
type RequestPart = 'body' | 'query' | 'params';
export declare const validate: (schema: ZodSchema, part?: RequestPart) => (req: Request, res: Response, next: NextFunction) => void;
export {};
