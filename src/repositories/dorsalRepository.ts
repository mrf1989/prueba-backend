import { Bson, Collection, Component, Database } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Dorsal } from "../models/models.ts";

const ERROR_NOT_FOUND = new Error("No se encuentran dorsales");

@Component()
export class DorsalRepository {
  private db!: Database;
  private dorsales!: Collection<Dorsal>;

  constructor(private readonly storage: DBManagement) {
    this.init();
  }

  private async init() {
    this.db = await this.storage.connect();
    this.dorsales = this.storage.getCollection("dorsales", this.db);
  }

  public async getAll(filter: Bson.Document): Promise<Dorsal[]> {
    const dorsales = await this.dorsales.find(filter, {
      noCursorTimeout: false,
    }).toArray();
    if (!dorsales.length) throw ERROR_NOT_FOUND;
    return dorsales;
  }

  public async getDorsal(id: Bson.ObjectID): Promise<Dorsal> {
    const dorsal = await this.dorsales.findOne({ "_id": id }, {
      noCursorTimeout: false,
    });
    if (!dorsal) throw new Error("Dorsal no encontrado");
    return dorsal;
  }

  public async createDorsal(dorsal: Dorsal) {
    const res = await this.dorsales.insertOne(dorsal);
    if (!res) throw new Error("Error en la creación del dorsal");
    return res;
  }

  public async updateDorsal<T extends Dorsal>(
    id: Bson.ObjectID,
    payload: T,
  ): Promise<Dorsal> {
    try {
      const res = await this.dorsales.updateOne(
        { "_id": id },
        { $set: payload },
        { upsert: true },
      );
      if (res.modifiedCount != 1) {
        throw new Error("Error en la actualización del dorsal");
      }
      return await this.getDorsal(id);
    } catch (err) {
      throw err;
    }
  }
}
