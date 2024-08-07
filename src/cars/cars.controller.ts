import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { ICarsController } from './cars.controller.interface';
import { Request, Response, NextFunction } from 'express';
import { ValidateMiddleware } from '../common/validate.middleware';
import { CreateRentalDto, ReturnCarDto } from './cars.dto';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import jwt from 'jsonwebtoken';
import { ICarsService } from './cars.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { IAuthRepository } from '../auth/auth.repository.interface';
import { AuthMiddleware } from '../common/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car operations
 */
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
			{ path: '/:id', method: 'get', func: this.getCar },
			{
				path: '/:id/rent',
				method: 'post',
				func: this.rentCar,
				middlewares: [new ValidateMiddleware(CreateRentalDto), new AuthMiddleware(this.configService.get('SECRET'))],
			},
			{
				path: '/return',
				method: 'put',
				func: this.returnCar,
				middlewares: [new ValidateMiddleware(ReturnCarDto), new AuthMiddleware(this.configService.get('SECRET'))],
			},
		]);
	}

	/**
	 * @swagger
	 * /cars:
	 *   get:
	 *     summary: Get all available cars
	 *     tags: [Cars]
	 *     responses:
	 *       200:
	 *         description: The list of available cars
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Car'
	 *       500:
	 *         description: Internal server error
	 */
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

	/**
	 * @swagger
	 * /cars/{id}:
	 *   get:
	 *     summary: Get a car by ID
	 *     tags: [Cars]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The car ID
	 *     responses:
	 *       200:
	 *         description: The car details
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Car'
	 *       404:
	 *         description: Car not found
	 *       500:
	 *         description: Internal server error
	 */
	async getCar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const carId = req.params.id;
			const token = req.headers['authorization']?.split(' ')[1];

			if (!token) {
				const car = await this.carsService.getCarById(carId);
				if (!car) {
					res.status(404).json({ message: 'Car not found' });
					return;
				}
				res.status(200).json(car);
				return;
			} else {
				jwt.verify(token, this.configService.get('SECRET'), async (err, decoded) => {
					if (err) {
						res.status(401).json({ message: 'Failed to authenticate token' });
						return;
					}

					const userPhone = (decoded as any).phone;
					const user = await this.authRepository.findByPhone(userPhone);
					if (!user) {
						res.status(401).json({ message: 'User not found' });
						return;
					}

					const car = await this.carsService.getCarById(carId, user.id);
					if (!car) {
						res.status(404).json({ message: 'Car not found' });
						return;
					}
					res.status(200).json(car);
					return;
				});
			}
		} catch (error) {
			next(new HTTPError(500, 'Failed to get car', 'getCar'));
		}
	}

	/**
	 * @swagger
	 * /cars/{id}/rent:
	 *   post:
	 *     summary: Rent a car
	 *     tags: [Cars]
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The car ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateRentalDto'
	 *     responses:
	 *       201:
	 *         description: Car rented successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                 status:
	 *                   type: string
	 *       401:
	 *         description: Unauthorized
	 *       400:
	 *         description: Invalid data (for example, a user is trying to rent a car which does not exist)
	 *       500:
	 *         description: Internal server error (Failed to rent car)
	 */
	async rentCar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const carId = req.params.id;
			const token = req.headers['authorization']?.split(' ')[1];

			if (!token) {
				res.status(401).json({ message: 'Unauthorized' });
				return;
			} else {
				jwt.verify(token, this.configService.get('SECRET'), async (err, decoded) => {
					if (err) {
						res.status(401).json({ message: 'Unauthorized' });
						return;
					}

					const userPhone = (decoded as any).phone;
					const user = await this.authRepository.findByPhone(userPhone);
					if (!user) {
						res.status(401).json({ message: 'Unauthorized' });
						return;
					}

					const userId = user.id;
					try {
						await this.carsService.rentCar(req.body, userId, carId);
						res.status(201).json({
							status: 'success',
							message: 'Car rented successfully'
						});
						return;
					} catch (error) {
						if (error instanceof HTTPError) {
							res.status(400).json({ message: error.message });
							return;
						} else {
							next(new HTTPError(500, 'Failed to rent car', 'rentCar'));
							return;
						}
					}
				});
			}
		} catch (error) {
			next(new HTTPError(500, 'Failed to rent car', 'rentCar'));
		}
	}

	/**
	 * @swagger
	 * /cars/return:
	 *   put:
	 *     summary: Return a car
	 *     tags: [Cars]
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/ReturnCarDto'
	 *     responses:
	 *       200:
	 *         description: Car returned successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *       401:
	 *         description: Unauthorized
	 *       400:
	 *         description: Malformed request syntax
	 *       500:
	 *         description: Internal server error (Failed to return car)
	 */
	async returnCar(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = req.headers['authorization']?.split(' ')[1];

			if (!token) {
				res.status(401).json({ message: 'Unauthorized' });
				return;
			} else {
				jwt.verify(token, this.configService.get('SECRET'), async (err, decoded) => {
					if (err) {
						res.status(401).json({ message: 'Unauthorized' });
						return;
					}

					const userPhone = (decoded as any).phone;
					const user = await this.authRepository.findByPhone(userPhone);
					if (!user) {
						res.status(401).json({ message: 'Unauthorized' });
						return;
					}

					try {
						await this.carsService.returnCar(req.body);
					} catch (error) {
						if (error instanceof HTTPError) {
							res.status(400).json({ message: error.message });
							return;
						} else {
							next(new HTTPError(500, 'Failed to return car', 'rentCar'));
							return;
						}
					}
					this.ok(res, { message: 'Car returned successfully' });
				});
			}
		} catch (error) {
			next(new HTTPError(500, 'Failed to return car', 'returnCar'));
		}
	}
}
