import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const token = authHeader.split(' ')[1];
			verify(token, this.secret, (err, payload: any) => {
				if (err) {
					return res.status(401).json({ message: 'Unauthorized' });
				}
				req.user = payload.phone;
				next();
			});
		} else {
			return res.status(401).json({ message: 'No authorization header provided' });
		}
	}
}
