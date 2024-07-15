import { ICarsRepository } from './cars.repository.interface';
import { CarDocument, CarModel } from './cars.entity';
import { injectable } from 'inversify';

@injectable()
export class CarsRepository implements ICarsRepository {
	constructor() {}

	async getAvailableCars(): Promise<CarDocument[]> {
		return await CarModel.find({ available: true }).exec();
	}

	async getCarById(carId: string): Promise<CarDocument | null> {
		return await CarModel.findById(carId).exec();
	}

	async updateCarAvailability(carId: string, available: boolean): Promise<void> {
		await CarModel.findByIdAndUpdate(carId, { available }).exec();
	}
}
