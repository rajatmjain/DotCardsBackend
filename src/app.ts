import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { sequelize, testConnection, createSequelizeModelFromJSON } from "./lib/db";
import crudRouter from "./routes/collectionRoutes";

const app: Express = express();
const port: number = 3000;

// Parse JSON request bodies
app.use(bodyParser.json());

// CRUD Router
app.use("/", crudRouter);

// Simple route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is your REST API server!");
});

// Start the server and test the database connection
async function startServer(): Promise<void> {
  try {
    // Ensure the database connection is established
    await testConnection();

    // Create Sequelize models
    await createSequelizeModelFromJSON();

    // Sync the database models with the database
    await sequelize.sync({alter:true});

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

// Start the server
startServer();

export default app