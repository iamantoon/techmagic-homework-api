import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { CarModel, CarDocument } from '../cars/cars.entity';
import dotenv from 'dotenv';

dotenv.config();

const seedCars = async () => {
	try {
		await mongoose.connect(process.env.DB_URI!);

		const dataPath = path.join(__dirname, './../../cars.json');
		const carsData: CarDocument[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

		await CarModel.insertMany(carsData);

		console.log('Cars data seeded successfully.');
		process.exit();
	} catch (error) {
		console.error('Error seeding cars data:', error);
		process.exit(1);
	}
};

seedCars();
