import express, { Express } from 'express';
import cors from 'cors';
import { IConfigService } from './config/config.service.interface';
import { RentalController } from './rental/rental.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { AuthMiddleware } from './common/auth.middleware';
import { AuthController } from './auth/auth.controller';
import { MongoService } from './database/mongo.service';
import { CarsController } from './cars/cars.controller';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import { TYPES } from './types';
import { Server } from 'http';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.CarsController) private carsController: CarsController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.MongoService) private mongoService: MongoService,
		@inject(TYPES.RentalController) private rentalController: RentalController,
	) {
		this.app = express();
		this.port = 5000;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(cors());
	}

	useRoutes(): void {
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use('/auth', this.authController.router);
		this.app.use('/cars', this.carsController.router);
		this.app.use('/rentals', authMiddleware.execute.bind(authMiddleware), this.rentalController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.mongoService.connect();
		this.server = this.app.listen(this.port);
	}
}
