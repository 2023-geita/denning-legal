import { MongoClient, Db, WriteConcern } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define MONGODB_DB environment variable inside .env.local');
}

interface GlobalMongo {
  conn: { client: MongoClient; db: Db } | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  var mongo: GlobalMongo;
}

global.mongo = global.mongo || { conn: null, promise: null };

const connectToDatabase = async () => {
  try {
    if (global.mongo.conn) {
      console.log('Using existing MongoDB connection');
      return global.mongo.conn;
    }

    if (!global.mongo.promise) {
      console.log('Creating new MongoDB connection...');

      const opts = {
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 60000,
        heartbeatFrequencyMS: 5000,
        directConnection: false,
        ssl: true,
        tls: true,
        authSource: 'admin',
        w: 'majority' as const
      };

      try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
        
        global.mongo.promise = MongoClient.connect(MONGODB_URI, opts)
          .then((client) => {
            console.log('MongoDB connected successfully');
            const db = client.db(MONGODB_DB);
            console.log('Database selected:', MONGODB_DB);
            return { client, db };
          })
          .catch((error) => {
            console.error('MongoDB connection error:', error);
            global.mongo.promise = null;
            throw error;
          });
      } catch (error) {
        console.error('Error during MongoDB connection setup:', error);
        global.mongo.promise = null;
        throw error;
      }
    }

    try {
      global.mongo.conn = await global.mongo.promise;
      return global.mongo.conn;
    } catch (error) {
      console.error('Error awaiting MongoDB connection:', error);
      global.mongo.promise = null;
      throw error;
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default connectToDatabase; 