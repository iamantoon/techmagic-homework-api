import { Document, Schema, model } from 'mongoose';
import { CarDocument } from '../cars/cars.entity';
import { UserDocument } from '../auth/user.entity';

export interface IRental {
	car: CarDocument['_id'];
	user: UserDocument['_id'];
	startDate: Date;
	expectedReturnDate: Date;
	actualReturnDate?: Date;
	rentalCost: number;
	expectedRentalCost: number;
	discount: number;
	penalty?: number;
	finalRentalCost: number;
	status: 'active' | 'returned';
}

export interface RentalDocument extends IRental, Document {}

const rentalSchema = new Schema<RentalDocument>({
	car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	startDate: { type: Date, required: true, default: Date.now },
	expectedReturnDate: { type: Date, required: true },
	actualReturnDate: { type: Date },
	rentalCost: { type: Number, required: true },
	expectedRentalCost: { type: Number, required: true },
	discount: { type: Number, default: 0 },
	penalty: { type: Number, default: 0 },
	finalRentalCost: { type: Number, required: true },
	status: { type: String, enum: ['active', 'returned'], required: true },
});

export const RentalModel = model<RentalDocument>('Rental', rentalSchema);
