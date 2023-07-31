import { Router } from "express";
import {
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/collectionController";

const crudRouter = Router();

// Create
crudRouter.post("/:collection", createDocument);

// Read
crudRouter.get("/:collection/:id", getDocumentById);

// Update
crudRouter.put("/:collection/:id", updateDocument);

// Delete
crudRouter.delete("/:collection/:id", deleteDocument);


export default crudRouter;
