
import { Request, Response} from "express";
import { collections } from "../lib/db";

// Create
export const createDocument = async (req: Request, res: Response): Promise<Response> => {
  try {
    const collectionName = req.params.collection;
    const Model = collections[collectionName];
  
    if (!Model) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const document = await Model.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    return res.status(500).json({ error: "Failed to create document" });
  }
};

// Read
export const getDocumentById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const collectionName = req.params.collection;
    const Model = collections[collectionName];

    if (!Model) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const documentId = req.params.id;
    const document = await Model.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.json(document);
  } catch (error) {
    console.error("Error retrieving document:", error);
    return res.status(500).json({ error: "Failed to retrieve document" });
  }
};

// Update
export const updateDocument = async (req: Request, res: Response): Promise<Response> => {
  try {
    const collectionName = req.params.collection;
    const Model = collections[collectionName];

    if (!Model) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const documentId = req.params.id;
    const document = await Model.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    await document.update(req.body);
    return res.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({ error: "Failed to update document" });
  }
};

// Delete
export const deleteDocument = async (req: Request, res: Response): Promise<Response> => {
  try {
    const collectionName = req.params.collection;
    const Model = collections[collectionName];

    if (!Model) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const documentId = req.params.id;
    const document = await Model.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    await document.destroy();
    return res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({ error: "Failed to delete document" });
  }
};

