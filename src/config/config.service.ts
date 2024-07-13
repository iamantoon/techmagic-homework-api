import { injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
	private config: { [key: string]: string } = {};
	constructor() {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			console.error('Error loading .env file:', result.error);
		} else if (result.parsed) {
			this.config = result.parsed;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
