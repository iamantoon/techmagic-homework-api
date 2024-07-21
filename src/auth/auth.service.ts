import { inject, injectable } from 'inversify';
import { IAuthService } from './auth.service.interface';
import { LoginDto } from './DTOs/login.dto';
import { RegisterDto } from './DTOs/register.dto';
import { UserModel, UserDocument } from './user.entity';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IAuthRepository } from './auth.repository.interface';
import { UserProfileDto } from './DTOs/user.dto';
import { RentalDocument, RentalModel } from '../rental/rental.entity';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.AuthRepository) private authRepository: IAuthRepository,
	) {}

	async createUser(dto: RegisterDto): Promise<UserDocument | null> {
		const newUser = new UserModel(dto);
		const salt = Number(this.configService.get('SALT'));
		await newUser.setPassword(dto.password, salt);
		const existedUser = await this.authRepository.findByPhone(dto.phone);
		if (existedUser) return null;
		return newUser.save();
	}

	public async validateUser(dto: LoginDto): Promise<UserDocument | null> {
		const user = await this.authRepository.findByPhone(dto.phone);
		if (!user) {
			return null;
		}
		const isPasswordValid = await user.validatePassword(dto.password);
		if (!isPasswordValid) {
			return null;
		}
		return user;
	}

	async getUserProfile(userId: string): Promise<UserProfileDto> {
		return await this.authRepository.getUserProfile(userId);
	}
}
