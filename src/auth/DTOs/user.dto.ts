import { RentalDocument } from '../../rental/rental.entity';
import { UserDocument } from './../user.entity';

export interface UserProfileDto {
	user: UserDocument;
	closedRents: number;
	activeRents: number;
	lastRents: RentalDocument[];
}
