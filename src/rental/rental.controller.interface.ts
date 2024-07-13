import { Request, Response, NextFunction } from 'express';

export interface IRentalController {
	getRentalHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}
