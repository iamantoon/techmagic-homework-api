import { inject, injectable } from 'inversify';
import { CarWithRentCost, ICarsService } from './cars.service.interface';
import { RentalDocument, RentalModel } from '../rental/rental.entity';
import { ICarsRepository } from './cars.repository.interface';
import { CreateRentalDto, ReturnCarDto } from './DTOs/car.dto';
import { IAuthService } from '../auth/auth.service.interface';
import { CarDocument, CarModel } from './cars.entity';
import { TYPES } from '../types';

@injectable()
export class CarsService implements ICarsService {
	constructor(
		@inject(TYPES.CarsRepository) private carsRepository: ICarsRepository,
		@inject(TYPES.AuthService) private authService: IAuthService,
	) {}

	async getAvailableCars(userId?: string): Promise<CarWithRentCost[]> {
		const cars = await CarModel.find({ available: true }).exec();

		if (userId) {
			const discount = await this.calculateDiscount(userId);
			return cars.map((car) => ({
				...car.toObject(),
				rentCost: this.calculateDiscountedRentalCost(car.year, discount),
				discount: discount
			}));
		} else {
			return cars.map((car) => ({
				...car.toObject(),
				rentCost: this.calculateDefaultRentalCost(car.year),
			}));
		}
	}

	async getCarById(carId: string, userId?: string): Promise<CarWithRentCost> {
        const car = await this.carsRepository.getCarById(carId);
        if (!car) {
            throw new Error('Car not found');
        }

        let rentCost;
        if (userId) {
            const discount = await this.calculateDiscount(userId);
            rentCost = this.calculateDiscountedRentalCost(car.year, discount);
        } else {
            rentCost = this.calculateDefaultRentalCost(car.year);
        }

        return {
            ...car.toObject(),
            rentCost
        };
    }

	async rentCar(dto: CreateRentalDto): Promise<CarDocument | null> {
		try {
			const car = await CarModel.findById(dto.carId);
			if (!car || !car.available) throw new Error('Car is not available');
	
			const rentalCost = this.calculateRentalCost(dto.expectedReturnDate, new Date(), car.year);
			const discount = await this.calculateDiscount(dto.userId);
			const expectedRentalCost = rentalCost - discount;
	
			const rental = new RentalModel({
				car: dto.carId,
				user: dto.userId,
				startDate: new Date(),
				expectedReturnDate: dto.expectedReturnDate,
				rentalCost,
				expectedRentalCost,
				discount,
				penalty: 0,
				finalRentalCost: expectedRentalCost,
				status: 'active',
			});
	
			await rental.save();
			
			car.available = false;
			await car.save();
	
			return car;
		} catch (error) {
			throw new Error('Failed to rent car');
		}
	}

	async returnCar(dto: ReturnCarDto): Promise<RentalDocument | null> {
		const rental = await RentalModel.findById(dto.rentalId).populate('car user').exec();
		if (!rental) throw new Error('Rental not found');
		if (rental.status !== 'active') throw new Error('Rental is not active');

		const car = rental.car as CarDocument;
		const actualReturnDate = new Date();
		const penalty = this.calculatePenalty(rental.expectedReturnDate, actualReturnDate, dto.isDamaged);

		rental.actualReturnDate = actualReturnDate;
		rental.penalty = penalty;
		rental.status = 'returned';
		await rental.save();

		car.available = true;
		await car.save();

		return rental;
	}

	private async calculateDiscount(userId: string): Promise<number> {
		const rentalsCount = await RentalModel.countDocuments({ user: userId, status: 'returned' });
		const discountRate = Math.min(20, Math.floor(rentalsCount / 5) * 5);
		const averageRentalCost = 50;
		return (discountRate / 100) * averageRentalCost;
	}

	private calculateDiscountedRentalCost(year: number, discount: number): number {
		return this.calculateDefaultRentalCost(year) - discount;
	}

	private calculateDefaultRentalCost(year: number): number {
		const baseRate = 50;
		const ageFactor = (new Date().getFullYear() - year) * 0.05;
		return baseRate + baseRate * ageFactor;
	}

	private calculateRentalCost(expectedReturnDate: Date, startDate: Date, year: number): number {
		const durationInDays = (new Date(expectedReturnDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
		const dailyRate = this.calculateDefaultRentalCost(year);
		return Math.ceil(durationInDays) * dailyRate;
	}

	private calculatePenalty(expectedReturnDate: Date, actualReturnDate: Date, isDamaged: boolean): number {
		let penalty = 0;
		if (actualReturnDate > expectedReturnDate) {
			const lateDays = (actualReturnDate.getTime() - expectedReturnDate.getTime()) / (1000 * 3600 * 24);
			penalty += lateDays * 50;
		}
		if (isDamaged) penalty += 200;

		return penalty;
	}
}
