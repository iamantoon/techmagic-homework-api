import { Request, Response, NextFunction } from 'express';
import { Exception } from './exception.filter.interface';
import { HTTPError } from './http-error.class';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements Exception {
	constructor() {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			res.status(err.statusCode).send({ err: err.message });
		} else {
			res.status(500).send({ err: err.message });
		}
	}
}
