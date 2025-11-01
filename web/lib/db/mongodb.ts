import { MongoClient, ServerApiVersion } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn("MongoDB: falta MONGODB_URI en el entorno");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
    strict: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri ?? "", options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri ?? "", options);
  clientPromise = client.connect();
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getMongoDb() {
  const clientInstance = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME ?? "async_collab";
  return clientInstance.db(dbName);
}
