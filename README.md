**Installation**

1. Download or clone the repository
2. Create a .env file in the root directory and configure it based on the provided .env.example file
3. Install dependencies: `npm install`
4. Seed the database. Run the following command to seed the database with initial data. You only need to do this once: `npm run seed`
6. Start the server: `npm run dev`. The server will start on port 5000

**Usage**

1. Access the API: Navigate to http://localhost:5000 to access the API.
2. View Swagger documentation: Navigate to http://localhost:5000/api-docs/ to view the Swagger documentation for the API.

**Additional Notes**

Ensure your MongoDB database is accessible and the URI in your .env file is correct.