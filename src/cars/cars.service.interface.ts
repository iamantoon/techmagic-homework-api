import { CreateRentalDto, ReturnCarDto } from './DTOs/car.dto';
import { RentalDocument } from '../rental/rental.entity';
import { CarDocument, ICar } from './cars.entity';

export interface ICarsService {
	getAvailableCars(userId?: string): Promise<CarWithRentCost[]>;
	rentCar(dto: CreateRentalDto): Promise<CarDocument | null>;
	returnCar(dto: ReturnCarDto): Promise<RentalDocument | null>;
}

export interface CarWithRentCost extends Omit<ICar, 'rentCost'> {
	rentCost: number;
}