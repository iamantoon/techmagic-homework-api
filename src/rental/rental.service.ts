import { IRentalRepository } from './rental.repository.interface';
import { IRentalService } from './rental.service.interface';
import { RentalDocument } from './rental.entity';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { ICarsRepository } from '../cars/cars.repository.interface';

@injectable()
export class RentalService implements IRentalService {
	constructor(
		@inject(TYPES.RentalRepository) private rentalRepository: IRentalRepository,
		@inject(TYPES.CarsRepository) private carsRepository: ICarsRepository
	) {}

	async createRental(rentalData: Partial<RentalDocument>): Promise<RentalDocument> {
		return await this.rentalRepository.createRental(rentalData);
	}

	async getRentalById(rentalId: string): Promise<RentalDocument | null> {
		return await this.rentalRepository.getRentalById(rentalId);
	}

	async updateRental(rentalId: string, updateData: Partial<RentalDocument>): Promise<void> {
		await this.rentalRepository.updateRental(rentalId, updateData);
	}

	async getUserRentalHistory(userId: string): Promise<any[]> {
		const rentals = await this.rentalRepository.getUserRentals(userId);

		const returnedRentals = rentals.filter(rental => rental.status === 'returned');

		const returnedRentalDetails = await Promise.all(returnedRentals.map(async (rental) => {
			const car = await this.carsRepository.getCarById(rental.car as string);
			if (car) {
				return {
					_id: rental._id,
					startDate: rental.startDate,
					expectedReturnDate: rental.expectedReturnDate,
					actualReturnDate: rental.actualReturnDate,
					expectedRentalCost: rental.expectedRentalCost,
					discount: rental.discount,
					penalty: rental.penalty,
					finalRentalCost: rental.finalRentalCost,
					status: rental.status,
					car: {
						brand: car.brand,
						carModel: car.carModel
					},
					user: rental.user
				};
			} else {
				return rental;
			}
		}));
		
		return returnedRentalDetails.reverse();
	}

	async getUserActiveRentals(userId: string): Promise<any[]> {
		const rentals = await this.rentalRepository.getUserRentals(userId);
		
		const activeRentals = rentals.filter(rental => rental.status === 'active');
		
		const activeRentalDetails = await Promise.all(activeRentals.map(async (rental) => {
			const car = await this.carsRepository.getCarById(rental.car as string);
			if (car) {
				return {
					_id: rental._id,
					startDate: rental.startDate,
					expectedReturnDate: rental.expectedReturnDate,
					actualReturnDate: rental.actualReturnDate,
					expectedRentalCost: rental.expectedRentalCost,
					discount: rental.discount,
					penalty: rental.penalty,
					finalRentalCost: rental.finalRentalCost,
					status: rental.status,
					car: {
						brand: car.brand,
						carModel: car.carModel
					},
					carId: car._id,
					user: rental.user
				};
			} else {
				return rental;
			}
		}));

		return activeRentalDetails;
	}
}
