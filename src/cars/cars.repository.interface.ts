import { CarDocument } from './cars.entity';

export interface ICarsRepository {
	getAvailableCars(): Promise<CarDocument[]>;
	getCarById(carId: string): Promise<CarDocument | null>;
	updateCarAvailability(carId: string, available: boolean): Promise<void>;
}
