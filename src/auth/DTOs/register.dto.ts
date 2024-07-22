import { IsPhoneNumber, IsString, IsNotEmpty, Length } from 'class-validator';

export class RegisterDto {
	@IsString({ message: 'Invalid first name' })
	@IsNotEmpty({ message: 'First name cannot be empty' })
	firstName: string;

	@IsString({ message: 'Invalid last name' })
	@IsNotEmpty({ message: 'Last name cannot be empty' })
	lastName: string;

	@IsString({ message: 'Invalid patronymic' })
	@IsNotEmpty({ message: 'Patronymic cannot be empty' })
	patronymic: string;

	@IsString({ message: 'Invalid country' })
	@IsNotEmpty({ message: 'Country cannot be empty' })
	country: string;

	@IsString({ message: 'Invalid city' })
	@IsNotEmpty({ message: 'City cannot be empty' })
	city: string;

	@IsString({ message: 'Invalid address' })
	@IsNotEmpty({ message: 'Address cannot be empty' })
	address: string;

	@IsPhoneNumber('UA', { message: 'Invalid phone number' })
	phone: string;

	@IsString({ message: 'Invalid password' })
	@Length(8, undefined, { message: 'Password must be at least 8 characters long' })
	password: string;
}
