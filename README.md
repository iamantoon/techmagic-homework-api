# Car Rental Service API

## Installation

1. **Download or clone the repository:**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Create a `.env` file:**

   Create a `.env` file in the root directory and configure it based on the provided `.env.example` file.

3. **Install dependencies:**

   ```sh
   npm install
   ```

4. **Seed the database:**

   Run the following command to seed the database with initial data. You only need to do this once:

   ```sh
   npm run seed
   ```

   The seed data includes car information; no user or rental data is seeded.

5. **Start the server:**

   ```sh
   npm run dev
   ```

   The server will start on port `5000`.

## Usage

1. **Access the API:**

   Navigate to [http://localhost:5000](http://localhost:5000) to access the API.

2. **View Swagger documentation:**

   Navigate to [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/) to view the Swagger documentation for the API.
