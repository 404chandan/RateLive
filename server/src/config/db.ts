import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { env } from "./env.js";

let memoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<string> {
  if (env.MONGO_URI) {
    await mongoose.connect(env.MONGO_URI);
    return "external-mongodb";
  }

  memoryServer = await MongoMemoryServer.create({
    instance: { dbName: "ratelive" },
  });
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  return "in-memory-mongodb";
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
