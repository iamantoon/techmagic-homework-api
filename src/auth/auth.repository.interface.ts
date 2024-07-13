import { UserDocument } from './user.entity';

export interface IAuthRepository {
	create: (user: UserDocument) => Promise<any>;
	findByPhone: (phone: string) => Promise<any | null>;
}
