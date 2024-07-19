export class CreateRentalDto {
	userId: string;
	expectedReturnDate: Date;
}

export class ReturnCarDto {
	rentalId: string;
	userId: string;
	isDamaged: boolean;
}
