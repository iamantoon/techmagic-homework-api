import { RegisterDto } from './DTOs/register.dto';
import { LoginDto } from './DTOs/login.dto';
import { UserDocument } from './user.entity';

export interface IAuthService {
	createUser: (dto: RegisterDto) => Promise<UserDocument | null>;
	validateUser: (dto: LoginDto) => Promise<UserDocument | null>;
}
