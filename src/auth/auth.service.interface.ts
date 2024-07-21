import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { UserDocument } from './user.entity';
import { UserProfileDto } from './DTOs/user.dto';

export interface IAuthService {
	createUser: (dto: RegisterDto) => Promise<UserDocument | null>;
	validateUser: (dto: LoginDto) => Promise<UserDocument | null>;
	getUserProfile(userId: string): Promise<UserProfileDto>;
}
