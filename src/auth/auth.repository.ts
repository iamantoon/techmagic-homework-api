import { IAuthRepository } from './auth.repository.interface';
import { MongoService } from '../database/mongo.service';
import { UserModel, UserDocument } from './user.entity';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class AuthRepository implements IAuthRepository {
	constructor(@inject(TYPES.MongoService) private mongoService: MongoService) {}

	async create(user: UserDocument): Promise<UserDocument> {
		return await user.save();
	}

	async findByPhone(phone: string): Promise<UserDocument | null> {
		return await UserModel.findOne({ phone }).exec();
	}
}
