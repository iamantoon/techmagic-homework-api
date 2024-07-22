import { Request, Response, NextFunction } from 'express';

export interface ICarsController {
	getAvailableCars(req: Request, res: Response, next: NextFunction): Promise<void>;
	getCar(req: Request, res: Response, next: NextFunction): Promise<void>;
	rentCar(req: Request, res: Response, next: NextFunction): Promise<void>;
	returnCar(req: Request, res: Response, next: NextFunction): Promise<void>;
}
