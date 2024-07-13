import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
	@IsPhoneNumber('UA', { message: 'Invalid phone number' })
	phone: string;

	@IsString({ message: 'Invalid password' })
	password: string;
}
