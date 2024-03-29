import { Sequelize, DataTypes } from "sequelize";
import fs from "fs/promises";
import path from "path";
import {program} from "commander"

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default: any;
  primaryKey: boolean;
  autoIncrement: boolean;
}

interface Schema {
  table_name: string;
  columns: Column[];
}

interface Collections {
  [key: string]: any;
}

const collections: Collections = {};
const defaultDirectoryPathToScan = "./src/lib/schemas/";

// Commander to accept a custom path as a flag (--schema-path)
program.option("-p, --schema-path <path>", "Custom path for JSON schemas");
program.parse(process.argv);
const options = program.opts()

const directoryPathToScan = options.schemaPath || defaultDirectoryPathToScan;


// Create a new Sequelize instance and specify the database's location
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./storage/database.sqlite",
});

// Test the database connection
async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function createSequelizeModelFromJSON(): Promise<void> {
  const schemas = await processJsonFilesRecursively(directoryPathToScan);

  schemas.forEach((schema: Schema) => {
    // Extract table name, columns, and data from the JSON
    const { table_name: tableName, columns } = schema;

    // Define the model attributes
    const modelAttributes: { [key: string]: any } = {};
    columns.forEach((column: Column) => {
      modelAttributes[column.name] = {
        type: mapDataTypeToSequelize(column.type),
        allowNull: column.nullable,
        defaultValue: column.default,
        primaryKey: column.primaryKey,
        autoIncrement: column.autoIncrement,
      };
    });

    modelAttributes["createdAt"] = {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };
    modelAttributes["updatedAt"] = {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    };

    // Create the Sequelize model
    const Model = sequelize.define(tableName, modelAttributes);
    collections[tableName] = Model;
  });
}

// Helper function to map PostgreSQL data types to Sequelize data types
function mapDataTypeToSequelize(postgresDataType: string): any {
  const dataTypeMap: { [key: string]: any } = {
    integer: DataTypes.INTEGER,
    bigint: DataTypes.BIGINT,
    smallint: DataTypes.SMALLINT,
    decimal: DataTypes.DECIMAL,
    numeric: DataTypes.NUMBER,
    real: DataTypes.REAL,
    double: DataTypes.DOUBLE,
    text: DataTypes.TEXT,
    varchar: DataTypes.STRING,
    char: DataTypes.CHAR,
    boolean: DataTypes.BOOLEAN,
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    timestamp: DataTypes.DATE,
    timestamptz: DataTypes.DATE,
    json: DataTypes.JSON,
    jsonb: DataTypes.JSONB,
    uuid: DataTypes.UUID,
  };

  return dataTypeMap[postgresDataType] || DataTypes.STRING;
}

async function processJsonFilesRecursively(directoryPath: string): Promise<Schema[]> {
  const schemas: Schema[] = [];
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        // If it's a directory, recursively call the function
        const nestedSchemas = await processJsonFilesRecursively(filePath);
        schemas.push(...nestedSchemas);
      } else if (path.extname(file) === ".json") {
        // If it's a .json file, process it here
        console.log(`Processing ${filePath}`);
        const jsonData = await fs.readFile(filePath, "utf8");
        const parsedData = JSON.parse(jsonData);
        schemas.push(parsedData);
      }
    }
    return schemas;
  } catch (error) {
    console.error("Error while processing JSON files:", error);
    return schemas;
  }
}

// Export the connection instance
export { sequelize, testConnection, collections, createSequelizeModelFromJSON };

