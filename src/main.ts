import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { AuthController } from './auth/auth.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { TYPES } from './types';
import { Exception } from './errors/exception.filter.interface';
import { AuthService } from './auth/auth.service';
import { IAuthService } from './auth/auth.service.interface';
import { IAuthController } from './auth/auth.controller.interface';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { MongoService } from './database/mongo.service';
import { IAuthRepository } from './auth/auth.repository.interface';
import { AuthRepository } from './auth/auth.repository';
import { ICarsRepository } from './cars/cars.repository.interface';
import { CarsRepository } from './cars/cars.repository';
import { ICarsController } from './cars/cars.controller.interface';
import { CarsController } from './cars/cars.controller';
import { ICarsService } from './cars/cars.service.interface';
import { CarsService } from './cars/cars.service';
import { IRentalController } from './rental/rental.controller.interface';
import { RentalService } from './rental/rental.service';
import { RentalController } from './rental/rental.controller';
import { IRentalService } from './rental/rental.service.interface';
import { IRentalRepository } from './rental/rental.repository.interface';
import { RentalRepository } from './rental/rental.repository';

export interface Bootstrap {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<Exception>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IAuthController>(TYPES.AuthController).to(AuthController);
	bind<IAuthService>(TYPES.AuthService).to(AuthService);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<MongoService>(TYPES.MongoService).to(MongoService);
	bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);
	bind<ICarsRepository>(TYPES.CarsRepository).to(CarsRepository);
	bind<ICarsController>(TYPES.CarsController).to(CarsController);
	bind<ICarsService>(TYPES.CarsService).to(CarsService);
	bind<IRentalController>(TYPES.RentalController).to(RentalController);
	bind<IRentalService>(TYPES.RentalService).to(RentalService);
	bind<IRentalRepository>(TYPES.RentalRepository).to(RentalRepository);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): Bootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
