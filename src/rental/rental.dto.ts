export class CreateRentalDto {
	carId: string;
	userId: string;
	expectedReturnDate: Date;
}

export class ReturnCarDto {
	rentalId: string;
	actualReturnDate: Date;
	isDamaged: boolean;
}
