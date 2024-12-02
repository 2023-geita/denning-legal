import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) {
    console.log("Using cached database instance");
    return cachedDb;
  }

  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
    
    const db = client.db(process.env.MONGODB_DB);
    cachedDb = db;
    
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectToDatabase; 