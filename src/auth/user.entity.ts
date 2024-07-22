import { compare, hash } from 'bcryptjs';
import { Document, Schema, model } from 'mongoose';

export interface UserDocument extends Document {
	phone: string;
	firstName: string;
	lastName: string;
	patronymic: string;
	city: string;
	country: string;
	address: string;
	password: string;
	validatePassword(password: string): Promise<boolean>;
	setPassword(password: string, salt: number): Promise<void>;
}

const userSchema = new Schema<UserDocument>({
	phone: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	patronymic: { type: String, required: true },
	city: { type: String, required: true },
	country: { type: String, required: true },
	address: { type: String, required: true },
	password: { type: String, required: true },
}, { versionKey: false });

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
	if (!password || !this.password) {
		console.error('Password or stored hash is undefined');
		return false;
	}
	return await compare(password, this.password);
};

userSchema.methods.setPassword = async function (password: string, salt: number): Promise<void> {
	this.password = await hash(password, salt);
};

export const UserModel = model<UserDocument>('User', userSchema);
