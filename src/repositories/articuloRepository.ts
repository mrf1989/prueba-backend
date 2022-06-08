import { Bson, Collection, Component, Database } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Articulo } from "../models/models.ts";

@Component()
export class ArticuloRepository {
  private db!: Database;
  private articulos!: Collection<Articulo>;

  constructor(private readonly storage: DBManagement) {
    this.init();
  }

  private async init() {
    this.db = await this.storage.connect();
    this.articulos = this.storage.getCollection("articulos", this.db);
  }

  public async getAll(): Promise<Articulo[]> {
    const articulos = await this.articulos.find({}, { noCursorTimeout: false })
      .toArray();
    if (!articulos.length) throw new Error("No se encuentran artículos");
    return articulos;
  }

  public async getArticulo(id: Bson.ObjectID): Promise<Articulo> {
    const articulo = await this.articulos.findOne({ "_id": id }, {
      noCursorTimeout: false,
    });
    if (!articulo) throw new Error("Artículo no encontrado");
    return articulo;
  }

  public async createArticulo(articulo: Articulo): Promise<Bson.Document> {
    const res = await this.articulos.insertOne(articulo);
    if (!res) throw new Error("Error en la creación del artículo");
    return res;
  }

  public async updateArticulo<T extends Articulo>(
    id: Bson.ObjectID,
    payload: T,
  ) {
    const res = await this.articulos.updateOne(
      { "_id": id },
      { $set: payload },
      { upsert: true },
    );
    if (res.modifiedCount != 1) {
      throw new Error("Error en la actualización del artículo");
    }
    return await this.getArticulo(id);
  }

  public async deleteArticulo(id: Bson.ObjectID) {
    const res = await this.articulos.deleteOne({ "_id": id });
    if (!res) throw new Error("Error en la eliminación del artículo");
    return res;
  }
}
