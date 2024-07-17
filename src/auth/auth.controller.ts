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
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super();
		this.bindRoutes([
			{ path: '/login', method: 'post', func: this.login, middlewares: [new ValidateMiddleware(LoginDto)] },
			{ path: '/register', method: 'post', func: this.register, middlewares: [new ValidateMiddleware(RegisterDto)] },
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
			console.error('Error in login() catch block [auth.controller]: ', error);
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
