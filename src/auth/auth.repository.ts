import { RentalDocument, RentalModel } from '../rental/rental.entity';
import { IAuthRepository } from './auth.repository.interface';
import { UserModel, UserDocument } from './user.entity';
import { injectable } from 'inversify';

@injectable()
export class AuthRepository implements IAuthRepository {
	constructor() {}

	async create(user: UserDocument): Promise<UserDocument> {
		return await user.save();
	}

	async findByPhone(phone: string): Promise<UserDocument | null> {
		return await UserModel.findOne({ phone }).exec();
	}

	async getUserProfile(userId: string): Promise<any> {
		const user = await UserModel.findById(userId).exec();
		if (!user) {
			throw new Error('User not found');
		}

		const closedRents = await RentalModel.countDocuments({ user: userId, status: 'returned' }).exec();
		const activeRents = await RentalModel.countDocuments({ user: userId, status: 'active' }).exec();
		const lastRents = await RentalModel.find({ user: userId, status: 'returned' })
							.sort({ actualReturnDate: -1 })
							.limit(3)
							.populate('car', 'brand carModel')
							.exec();

		return {
			user,
			closedRents,
			activeRents,
			lastRents
		};
	}
}
