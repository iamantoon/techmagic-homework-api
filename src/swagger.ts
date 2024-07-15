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
        },
      },
      CreateRentalDto: {
        type: 'object',
        properties: {
          carId: {
            type: 'string',
            description: 'Car ID',},
            userId: {
              type: 'string',
              description: 'User ID',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Start date of the rental',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'End date of the rental',
            },
          },
          required: ['carId', 'userId', 'startDate', 'endDate'],
      },
      },
      ReturnCarDto: {
        type: 'object',
        properties: {
          rentalId: {
            type: 'string',
            description: 'Rental ID',
          },
          returnDate: {
            type: 'string',
            format: 'date-time',
            description: 'Return date of the car',
          },
        },
        required: ['rentalId', 'returnDate'],
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
