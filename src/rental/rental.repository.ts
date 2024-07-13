import { IRentalRepository } from './rental.repository.interface';
import { RentalModel, RentalDocument } from './rental.entity';
import { injectable } from 'inversify';

@injectable()
export class RentalRepository implements IRentalRepository {
	async createRental(rentalData: Partial<RentalDocument>): Promise<RentalDocument> {
		const rental = new RentalModel(rentalData);
		await rental.save();
		return rental;
	}

	async getRentalById(rentalId: string): Promise<RentalDocument | null> {
		return await RentalModel.findById(rentalId).exec();
	}

	async updateRental(rentalId: string, updateData: Partial<RentalDocument>): Promise<void> {
		await RentalModel.findByIdAndUpdate(rentalId, updateData).exec();
	}

	async getUserRentals(userId: string): Promise<RentalDocument[]> {
		return await RentalModel.find({ user: userId }).populate('car').exec();
	}
}
