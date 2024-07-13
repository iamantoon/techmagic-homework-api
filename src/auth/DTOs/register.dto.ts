import { IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
	@IsString({ message: 'Invalid first name' })
	firstName: string;

	@IsString({ message: 'Invalid last name' })
	lastName: string;

	@IsString({ message: 'Invalid patronymic' })
	patronymic: string;

	@IsString({ message: 'Invalid country' })
	country: string;

	@IsString({ message: 'Invalid city' })
	city: string;

	@IsString({ message: 'Invalid address' })
	address: string;

	@IsPhoneNumber('UA', { message: 'Invalid phone number' })
	phone: string;

	@IsString({ message: 'Invalid password' })
	password: string;
}
