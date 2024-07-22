import { Document, Schema, model } from 'mongoose';

export interface ICar {
	brand: string;
	carModel: string;
	year: number;
	cost: number;
	rentCost: number;
	type: string;
	available: boolean;
	photoUrl?: string;
}

export interface CarDocument extends ICar, Document {}

const carSchema = new Schema<CarDocument>({
	brand: { type: String, required: true },
	carModel: { type: String, required: true },
	year: { type: Number, required: true },
	cost: { type: Number, required: true },
	rentCost: { type: Number, required: false },
	type: { type: String, required: true },
	available: { type: Boolean, default: true },
	photoUrl: { type: String, required: false },
}, { versionKey: false });

export const CarModel = model<CarDocument>('Car', carSchema);
