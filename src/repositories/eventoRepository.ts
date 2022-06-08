import { Bson, Collection, Component, Database } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Evento } from "../models/models.ts";

@Component()
export class EventoRepository {
  private db!: Database;
  private eventos!: Collection<Evento>;

  constructor(private readonly storage: DBManagement) {
    this.init();
  }

  private async init() {
    this.db = await this.storage.connect();
    this.eventos = this.storage.getCollection("eventos", this.db);
  }

  public async getAll(filtro: Bson.Document): Promise<Evento[]> {
    const eventos = await this.eventos.find(filtro, { noCursorTimeout: false })
      .toArray();
    if (!eventos.length) throw new Error("No se encuentran eventos");
    return eventos;
  }

  public async getEvento(id: Bson.ObjectID): Promise<Evento> {
    const evento = await this.eventos.findOne({ "_id": id }, {
      noCursorTimeout: false,
    });
    if (!evento) throw new Error("Evento no encontrado");
    return evento;
  }

  public async createEvento(evento: Evento) {
    const res = await this.eventos.insertOne(evento);
    if (!res) throw new Error("Error en la creación del evento");
    return res;
  }

  public async updateEvento<T extends Evento>(
    id: Bson.ObjectID,
    payload: T,
  ): Promise<Evento> {
    try {
      const res = await this.eventos.updateOne(
        { "_id": id },
        { $set: payload },
        { upsert: true },
      );
      if (res.modifiedCount != 1) {
        throw new Error("Error en la actualización del evento");
      }
      return await this.getEvento(id);
    } catch (err) {
      throw err;
    }
  }

  public async deleteEvento(id: Bson.ObjectID) {
    try {
      const res = await this.eventos.deleteOne({ "_id": id });
      if (!res) throw new Error("Error en la eliminación del artículo");
      return res;
    } catch (err) {
      throw err;
    }
  }

  public async getEventos(ids: string[]) {
    const eventosId = ids.map((id) => new Bson.ObjectID(id));
    const eventos = await this.eventos.find({
      "_id:": { $in: eventosId },
    }, { noCursorTimeout: false }).toArray();
    return eventos;
  }
}
