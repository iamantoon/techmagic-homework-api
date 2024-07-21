import { UserDocument } from './../user.entity';

export interface UserProfileDto {
	user: UserDocument;
	totalRents: number;
	activeRents: number;
}
