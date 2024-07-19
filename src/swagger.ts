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
    schemas: {
      Car: {
        type: 'object',
        properties: {
          id: {
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
          rentCost: {
            type: 'number',
            description: 'Rental cost per hour',
          },
          available: {
            type: 'boolean',
            description: 'Availability status of the car',
          },
          photoUrl: {
            type: 'string',
            description: 'Photo of the car'
          }
        },
      },
      CreateRentalDto: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'User ID',
          },
          expectedReturnDate: {
            type: 'string',
            format: 'date-time',
            description: 'Expected end date of the rental',
          },
        },
        required: ['userId', 'expectedReturnDate'],
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
            description: 'Country of the user'
          },
          city: {
            type: 'string',
            description: 'City of the user'
          },
          address: {
            type: 'string',
            description: 'Address of the user'
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
        required: ['firstName', 'lastName', 'patronymic', 'country', 'city', 'address', 'phone', 'password', ],
      },
      Rental: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Rental ID',
          },
          carId: {
            type: 'string',
            description: 'Car ID',
          },
          userId: {
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
          },
          expectedRentalCost: {
            type: 'string',
            format: 'date-time',
            description: 'Expected rental cost of the rental',
          },
          actualRentalCost: {
            type: 'string',
            format: 'date-time',
            description: 'Actual rental cost of the rental',
          },
          status: {
            type: 'string',
            description: 'Status of the rental',
          },
        },
      },
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
