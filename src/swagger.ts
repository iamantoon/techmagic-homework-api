import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Express API with Swagger',
		version: '1.0.0',
		description: 'This is a simple CRUD API application made with Express and documented with Swagger',
	},
	servers: [
		{
			url: 'http://localhost:5000',
			description: 'Development server',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
			  type: 'http',
			  scheme: 'bearer',
			  bearerFormat: 'JWT',
			},
		},
		schemas: {
			Car: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'Car ID',
					},
					brand: {
						type: 'string',
						description: 'Car brand',
					},
					carModel: {
						type: 'string',
						description: 'Car model',
					},
					year: {
						type: 'number',
						description: 'Year of manufacture',
					},
					cost: {
						type: 'number',
						description: 'Cost of car',
					},
					type: {
						type: 'string',
						description: 'Type of car',
					},
					available: {
						type: 'boolean',
						description: 'Availability status of the car',
					},
					photoUrl: {
						type: 'string',
						description: 'Photo of the car',
					},
					rentCost: {
						type: 'number',
						description: 'Rental cost per hour',
					},
					discount: {
						type: 'number',
						description: 'Discount per day (if any)'
					}
				},
			},
			CreateRentalDto: {
				type: 'object',
				properties: {
					expectedReturnDate: {
						type: 'string',
						format: 'date-time',
						description: 'Expected end date of the rental',
					},
				},
				required: ['expectedReturnDate'],
			},
			ReturnCarDto: {
				type: 'object',
				properties: {
					rentalId: {
						type: 'string',
						description: 'Rental ID',
					},
					isDamaged: {
						type: 'boolean',
						description: 'Has the car been damaged?',
					},
				},
				required: ['rentalId', 'isDamaged'],
			},
			LoginDto: {
				type: 'object',
				properties: {
					phone: {
						type: 'string',
						description: 'Phone number of the user (Ukrainian numbers available only)',
					},
					password: {
						type: 'string',
						description: 'Password of the user',
					},
				},
				required: ['phone', 'password'],
			},
			RegisterDto: {
				type: 'object',
				properties: {
					firstName: {
						type: 'string',
						description: 'First name of the user',
					},
					lastName: {
						type: 'string',
						description: 'Last name of the user',
					},
					patronymic: {
						type: 'string',
						description: 'Patronymic of the user',
					},
					country: {
						type: 'string',
						description: 'Country of the user',
					},
					city: {
						type: 'string',
						description: 'City of the user',
					},
					address: {
						type: 'string',
						description: 'Address of the user',
					},
					phone: {
						type: 'string',
						description: 'Phone number of the user',
					},
					password: {
						type: 'string',
						description: 'Password of the user',
					},
				},
				required: ['firstName', 'lastName', 'patronymic', 'country', 'city', 'address', 'phone', 'password'],
			},
			Rental: {
				type: 'object',
				properties: {
				  	_id: {
						type: 'string',
						description: 'Rental ID',
				  	},
				  	// carId: {
					// 	type: 'string',
					// 	description: 'Car ID',
				  	// },
				  	car: {
						type: 'object',
						properties: {
					  		brand: {
								type: 'string',
								description: 'Car brand',
					  		},
					  		carModel: {
								type: 'string',
								description: 'Car model',
					  		},
						},
				  	},
				  	user: {
						type: 'string',
						description: 'User ID',
				  	},
				  	startDate: {
						type: 'string',
						format: 'date-time',
						description: 'Start date of the rental',
				  	},
				  	expectedReturnDate: {
						type: 'string',
						format: 'date-time',
						description: 'Expected return date of the rental',
				  	},
				  	actualReturnDate: {
						type: 'string',
						format: 'date-time',
						description: 'Actual end date of the rental',
						nullable: true,
				  	},
				  		expectedRentalCost: {
						type: 'number',
						description: 'Expected rental cost of the rental',
				  	},
				  	finalRentalCost: {
						type: 'number',
						description: 'Actual rental cost of the rental',
				  	},
				  	status: {
						type: 'string',
						description: 'Status of the rental',
				  	},
				  	penalty: {
						type: 'number',
						description: 'Penalty for the rental',
				  	},
				  	discount: {
						type: 'number',
						description: 'Applied discount for the rental',
				  	},
				},
			},
			User: {
				type: 'object',
				properties: {
					_id: {
						type: 'string',
						description: 'Unique ID of the user'
					},
					address: {
						type: 'string',
						description: 'Address of the user'
					},
					city: {
						type: 'string',
						description: 'City of the user'
					},
					country: {
						type: 'string',
						description: 'Country of the user'
					},
					firstName: {
						type: 'string',
						description: 'First name of the user'
					},
					lastName: {
						type: 'string',
						description: 'Last name of the user'
					},
					patronymic: {
						type: 'string',
						description: 'The name of the father of the user'
					},
					phone: {
						type: 'string',
						description: 'A phone number of the user (in Ukrainian format)'
					}
				}
			}
		},
	},
};

const options = {
	swaggerDefinition,
	apis: ['./src/auth/*.ts', './src/cars/*.ts', './src/rental/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
