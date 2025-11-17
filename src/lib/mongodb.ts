import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;

const shouldUseTls =
  process.env.MONGODB_TLS?.toLowerCase() === "true" ||
  uri.startsWith("mongodb+srv://");

const options: MongoClientOptions = shouldUseTls
  ? {
      tls: true,
      tlsAllowInvalidCertificates: true, // relaxed dev defaults for self-signed certs
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    }
  : {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;