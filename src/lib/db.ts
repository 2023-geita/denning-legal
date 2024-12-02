import { MongoClient, ObjectId } from 'mongodb';
import connectToDatabase from './mongodb';

// Type for the error handler
type DbError = Error & { code?: string };

// Get database instance
export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

// Collection getters
export async function getCollection(collectionName: string) {
  const db = await getDb();
  return db.collection(collectionName);
}

export async function getMattersCollection() {
  return getCollection('matters');
}

export async function getClientsCollection() {
  return getCollection('clients');
}

export async function getDocumentsCollection() {
  return getCollection('documents');
}

export async function getTasksCollection() {
  return getCollection('tasks');
}

export async function getSessionsCollection() {
  return getCollection('sessions');
}

export async function getBillingsCollection() {
  return getCollection('billings');
}

// Generic CRUD operations
export async function findById(collectionName: string, id: string) {
  try {
    const collection = await getCollection(collectionName);
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    handleDbError(error);
    return null;
  }
}

export async function findMany(collectionName: string, query = {}, options = {}) {
  try {
    const collection = await getCollection(collectionName);
    return collection.find(query, options).toArray();
  } catch (error) {
    handleDbError(error);
    return [];
  }
}

export async function insertOne(collectionName: string, data: any) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...data, _id: result.insertedId };
  } catch (error) {
    handleDbError(error);
    return null;
  }
}

export async function updateOne(collectionName: string, id: string, data: any) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    return result?.value || null;
  } catch (error) {
    handleDbError(error);
    return null;
  }
}

export async function deleteOne(collectionName: string, id: string) {
  try {
    const collection = await getCollection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    handleDbError(error);
    return false;
  }
}

// Error handling
export function handleDbError(error: unknown): never {
  console.error('Database error:', error);
  const dbError = error as DbError;
  
  if (dbError.code === '23505') { // Unique violation
    throw new Error('A record with this identifier already exists');
  }
  
  if (dbError.code === '23503') { // Foreign key violation
    throw new Error('This operation would violate referential integrity');
  }
  
  throw new Error(dbError.message || 'An unexpected database error occurred');
} 