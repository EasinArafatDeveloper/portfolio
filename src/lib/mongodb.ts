import { MongoClient, type Db } from "mongodb";

// Reuse one client across hot reloads / serverless invocations.
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri).connect().catch((err) => {
      globalForMongo._mongoClient = undefined;
      throw err;
    });
  }
  const client = await globalForMongo._mongoClient;
  return client.db(process.env.MONGODB_DB || "portfolio");
}
