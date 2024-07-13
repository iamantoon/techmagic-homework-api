import { RentalDocument } from './rental.entity';

export interface IRentalRepository {
	createRental(rentalData: Partial<RentalDocument>): Promise<RentalDocument>;
	getRentalById(rentalId: string): Promise<RentalDocument | null>;
	updateRental(rentalId: string, updateData: Partial<RentalDocument>): Promise<void>;
	getUserRentals(userId: string): Promise<RentalDocument[]>;
}
