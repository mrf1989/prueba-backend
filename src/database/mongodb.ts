import { Collection, Component, Database, MongoClient } from "../../deps.ts";

@Component()
export class DBManagement {
  public async connect(): Promise<Database> {
    const client = new MongoClient();

    const MONGODB_URI = Deno.env.get("MONGODB_URI");
    if (!MONGODB_URI) {
      throw new Error("La variable de entorno MONGODB_URI no está configurada");
    }

    try {
      await client.connect(MONGODB_URI);
      return client.database("muevete");
    } catch (err) {
      console.error("Error de conexión a MongoDB", err);
      throw err;
    }
  }

  public getCollection<T>(name: string, db: Database): Collection<T> {
    return db.collection<T>(name);
  }
}
