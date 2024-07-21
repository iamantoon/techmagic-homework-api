import { RentalDocument } from '../rental/rental.entity';
import { UserDocument } from './user.entity';

export interface IAuthRepository {
	create: (user: UserDocument) => Promise<any>;
	findByPhone: (phone: string) => Promise<any | null>;
	getUserProfile(userId: string): Promise<any>;
}
