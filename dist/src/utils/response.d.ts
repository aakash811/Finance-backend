import { Response } from 'express';
import { ApiResponse } from '../types';
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number, meta?: ApiResponse["meta"]) => Response;
export declare const sendError: (res: Response, message: string, statusCode?: number, errors?: unknown) => Response;
