import { Request, Response, NextFunction } from 'express';
import { IConfigService } from '../config/config.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IAuthController } from './auth.controller.interface';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.class';
import { RegisterDto } from './DTOs/register.dto';
import { inject, injectable } from 'inversify';
import { AuthService } from './auth.service';
import { LoginDto } from './DTOs/login.dto';
import { sign } from 'jsonwebtoken';
import { TYPES } from '../types';
import 'reflect-metadata';
import { UserProfileDto } from './DTOs/user.dto';
import { AuthMiddleware } from '../common/auth.middleware';
import { AuthRepository } from './auth.repository';
import jwt from 'jsonwebtoken';

@injectable()
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.AuthService) private authService: AuthService,
		@inject(TYPES.AuthRepository) private authRepository: AuthRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super();
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login, middlewares: [new ValidateMiddleware(LoginDto)] },
			{ path: '/register', method: 'post', func: this.register, middlewares: [new ValidateMiddleware(RegisterDto)] },
			{ path: '/account', method: 'get', func: this.getUserProfile, middlewares: [new AuthMiddleware(this.configService.get('SECRET'))] }
		]);
	}

	/**
	 * @swagger
	 * /auth/login:
	 *   post:
	 *     summary: Login a user
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/LoginDto'
	 *     responses:
	 *       200:
	 *         description: Successfully logged in
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: string
	 *                 firstName:
	 *                   type: string
	 *                 lastName:
	 *                   type: string
	 *                 jwt:
	 *                   type: string
	 *       401:
	 *         description: Unauthorized
	 *       500:
	 *         description: Internal server error
	 */
	async login(req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = await this.authService.validateUser(req.body);
			if (!user) {
				next(new HTTPError(401, 'Error occurred while validating user', 'login'));
				return;
			}
			const jwt = await this.signJWT(req.body.phone, this.configService.get('SECRET'));
			const { _id, firstName, lastName } = user;
			this.ok(res, { id: _id, firstName, lastName, jwt });
		} catch (error) {
			if (!res.headersSent) {
				next(new HTTPError(500, 'Internal Server Error', 'login'));
			}
		}
	}

	/**
	 * @swagger
	 * /auth/register:
	 *   post:
	 *     summary: Register a new user
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/RegisterDto'
	 *     responses:
	 *       200:
	 *         description: Successfully registered
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 result:
	 *                   type: object
	 *                 jwt:
	 *                   type: string
	 *       422:
	 *         description: User already exists
	 *       500:
	 *         description: Internal server error
	 */
	async register(req: Request<{}, {}, RegisterDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.authService.createUser(req.body);
			if (!result) {
				next(new HTTPError(422, 'User already exists'));
				return;
			}
			const jwt = await this.signJWT(req.body.phone, this.configService.get('SECRET'));
			const { _id, firstName, lastName } = result;
			this.ok(res, { id: _id, firstName, lastName, jwt });
		} catch (error) {
			if (!res.headersSent) {
				next(new HTTPError(500, 'Internal Server Error', 'register'));
			}
		}
	}

	/**
	 * @swagger
	 * /auth/profile:
	 *   get:
	 *     summary: Get the profile of the logged-in user
	 *     tags: [Auth]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User profile data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 user:
	 *                   $ref: '#/components/schemas/User'
	 *                 closedRents:
	 *                   type: number
	 *                 activeRents:
	 *                   type: number
	 *                 lastRents:
	 *                   type: array
	 *                   items:
	 *                     $ref: '#/components/schemas/Rental'
	 *       401:
	 *         description: Unauthorized
	 *       404:
	 *         description: User not found
	 */
	async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const token = req.headers['authorization']?.split(' ')[1];

			if (!token) {
				res.status(401).json({ message: 'Unauthorized' });
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
						res.status(400).json({ message: 'User not found' });
						return;
					}

					const userId = user.id;

					const userProfile: UserProfileDto = await this.authService.getUserProfile(userId);
					res.status(200).json(userProfile);
				})
			}
		} catch (error) {
			next(error);
		}
	}

	private signJWT(phone: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					phone,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) reject(err);
					resolve(token as string);
				},
			);
		});
	}
}
