import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ICarsController } from './cars.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '../common/auth.guard';
import { ValidateMiddleware } from '../common/validate.middleware';
import { CreateRentalDto, ReturnCarDto } from './DTOs/car.dto';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import jwt from 'jsonwebtoken';
import { ICarsService } from './cars.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { IAuthRepository } from '../auth/auth.repository.interface';

@injectable()
export class CarsController extends BaseController implements ICarsController {
	constructor(
		@inject(TYPES.CarsService) private carsService: ICarsService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.AuthRepository) private authRepository: IAuthRepository,
	) {
		super();
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getAvailableCars },
			{
				path: '/:carId/rent',
				method: 'post',
				func: this.rentCar,
				middlewares: [new ValidateMiddleware(CreateRentalDto), new AuthGuard()],
			},
			{
				path: '/return',
				method: 'post',
				func: this.returnCar,
				middlewares: [new ValidateMiddleware(ReturnCarDto), new AuthGuard()],
			},
		]);
	}

	async getAvailableCars(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = req.headers['authorization']?.split(' ')[1];
			if (!token) {
				const cars = await this.carsService.getAvailableCars();
				res.status(200).json(cars);
			} else {
				jwt.verify(token, this.configService.get('SECRET'), async (err, decoded) => {
					if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

					const userPhone = (decoded as any).phone;
					const user = await this.authRepository.findByPhone(userPhone);
					if (!user) return res.status(401).json({ message: 'User not found' });

					const userId = user.id;
					const cars = await this.carsService.getAvailableCars(userId);
					res.status(200).json(cars);
				});
			}
		} catch (error) {
			next(new HTTPError(500, 'Failed to get available cars', 'getAvailableCars'));
		}
	}

	async rentCar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const car = await this.carsService.rentCar(req.body);
			this.ok(res, { message: 'Car rented successfully' });
		} catch (error) {
			next(new HTTPError(500, 'Failed to rent car', 'rentCar'));
		}
	}

	async returnCar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.carsService.returnCar(req.body);
			this.ok(res, { message: 'Car returned successfully' });
		} catch (error) {
			next(new HTTPError(500, 'Failed to return car', 'returnCar'));
		}
	}
}
