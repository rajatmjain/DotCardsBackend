# DotCardsBackend

DotCardsBackend is a RESTful API server built using Node.js, Express, and Sequelize, providing CRUD operations for managing collections of data. It allows you to create, read, update, and delete documents in various collections. The API is backed by an SQLite database, and it uses Sequelize to define and interact with the database models.

## Installation

To run the API server locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/rajatmjain/DotCardsBackend.git
   cd DotCardsBackend
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```

The API server will be running at http://localhost:3000.

## Usage

The API server provides endpoints to interact with various collections of data. You can use tools like curl or Postman to make requests to the API. Refer to the API Endpoints section for details on the available endpoints.

## API Endpoints

The API provides the following endpoints:

POST `/:collection:` Create a new document in the specified collection.

GET `/:collection/:id:` Get a document by its ID from the specified collection.

PUT `/:collection/:id:` Update a document by its ID in the specified collection.

DELETE `/:collection/:id:` Delete a document by its ID from the specified collection.

For more detailed information and usage examples, refer to the Postman Collection section.

## JSON Schemas

The JSON schemas for defining the database tables are located in the `src/lib/schemas/ directory``. The schemas are used to create the Sequelize models for each collection.

To inject schemas from an external directory run the following command:

```
npx ts-node src/app.ts -p <pathToDirectory>
```

The -p or --schema-path flag allows you to specify a custom path to the JSON schemas. Replace `<pathToDirectory>` with the actual path to your desired JSON schemas. If the -p flag is not provided, the server will use the default directory path.

## Postman Collection

You can find a Postman collection with pre-configured requests to test the API endpoints in the PostmanCollection directory in the root of the project. Import the collection into Postman to easily run the requests and see the API responses.

## Contributing

If you have any questions or need further assistance, feel free to reach out.
