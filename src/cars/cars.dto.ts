import { IsDateString, IsString, IsBoolean } from 'class-validator';

export class CreateRentalDto {
	@IsDateString()
	expectedReturnDate: Date;
}

export class ReturnCarDto {
	@IsString()
	rentalId: string;

	@IsBoolean()
	isDamaged: boolean;
}
