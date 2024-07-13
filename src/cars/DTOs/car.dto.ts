export class CreateRentalDto {
	carId: string;
	userId: string;
	expectedReturnDate: Date;
}

export class ReturnCarDto {
	rentalId: string;
	userId: string;
	isDamaged: boolean;
}
