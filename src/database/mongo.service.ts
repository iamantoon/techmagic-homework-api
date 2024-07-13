import { injectable } from 'inversify';
import mongoose, { Model, Schema } from 'mongoose';

@injectable()
export class MongoService {
	private connection: typeof mongoose;

	async connect(): Promise<void> {
		try {
			this.connection = await mongoose.connect(process.env.DB_URI!);
			console.log('Connected to MongoDB');
		} catch (error) {
			console.error('Failed to connect to MongoDB', error);
			process.exit(1);
		}
	}

	getModel<T extends Document>(name: string, schema: Schema<T>): Model<T> {
		return this.connection.model<T>(name, schema);
	}
}
