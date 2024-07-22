import { IRentalController } from './rental.controller.interface';
import { BaseController } from '../common/base.controller';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { RentalService } from './rental.service';
import { AuthGuard } from '../common/auth.guard';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ConfigService } from '../config/config.service';
import { AuthRepository } from '../auth/auth.repository';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Active and returned rentals
 */
@injectable()
export class RentalController extends BaseController implements IRentalController {
	constructor(
		@inject(TYPES.RentalService) private rentalService: RentalService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.AuthRepository) private authRepository: AuthRepository,
	) {
		super();
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.getRentalHistory,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/active',
				method: 'get',
				func: this.getActiveRentals,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	/**
	 * @swagger
	 * /rentals:
	 *   get:
	 *     summary: Get rental history
	 *     tags: [Rentals]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: List of rental history
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Rental'
	 *       401:
	 *         description: Unauthorized
	 *       500:
	 *         description: Internal server error
	 */
	async getRentalHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = req.headers['authorization']?.split(' ')[1];
			if (!token) {
				res.status(401).json({ message: 'Failed to authenticate token' });
				return;
			} else {
				jwt.verify(token, this.configService.get('SECRET'), async (err, decoded) => {
					if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

					const userPhone = (decoded as any).phone;
					const user = await this.authRepository.findByPhone(userPhone);
					if (!user) return res.status(401).json({ message: 'User not found' });

					const userId = user.id;
					const rentals = await this.rentalService.getUserRentalHistory(userId);
					res.status(200).json(rentals);
				});
			}
		} catch (error) {
			next(new HTTPError(500, 'Failed to get available cars', 'getAvailableCars'));
		}
	}

	/**
	 * @swagger
	 * /rentals/active:
	 *   get:
	 *     summary: Get active rentals
	 *     tags: [Rentals]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: List of active rentals
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Rental'
	 *       401:
	 *         description: Unauthorized
	 *       500:
	 *         description: Internal server error
	 */
	async getActiveRentals(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = req.headers['authorization']?.split(' ')[1];
			if (!token) {
				res.status(401).json({ message: 'Failed to authenticate token' });
				return;
			} else {
				jwt.verify(token, this.configService.get('SECRET'), async (err, decoded) => {
					if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

					const userPhone = (decoded as any).phone;
					const user = await this.authRepository.findByPhone(userPhone);
					if (!user) return res.status(401).json({ message: 'User not found' });

					const userId = user.id;
					const rentals = await this.rentalService.getUserActiveRentals(userId);
					res.status(200).json(rentals);
				});
			}
		} catch (error) {
			next(new HTTPError(500, 'Failed to get available cars', 'getAvailableCars'));
		}
	}
}
