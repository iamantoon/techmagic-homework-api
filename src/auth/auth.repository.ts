import { IAuthRepository } from './auth.repository.interface';
import { UserModel, UserDocument } from './user.entity';
import { injectable, inject } from 'inversify';

@injectable()
export class AuthRepository implements IAuthRepository {
	constructor() {}

	async create(user: UserDocument): Promise<UserDocument> {
		return await user.save();
	}

	async findByPhone(phone: string): Promise<UserDocument | null> {
		return await UserModel.findOne({ phone }).exec();
	}
}
