import { Bson, Service } from "../../deps.ts";
import { EventoRepository } from "../repositories/repositories.ts";
import { Evento } from "../models/models.ts";

const ERROR_DURACION_EVENTO = new Error(
  "El evento debe durar un mínimo de 7 días",
);

@Service()
export class EventoService {
  constructor(private readonly eventoRepository: EventoRepository) {}

  public async getAllEventos(filtros: Map<string, string>): Promise<Evento[]> {
    try {
      const filter: Bson.Document = {};
      if (filtros.size > 0) {
        if (filtros.has("objetivoKm")) {
          filter.objetivoKm = { $gte: parseInt(filtros.get("objetivoKm")!) };
        }
        if (filtros.has("modalidad")) {
          filter.modalidad = filtros.get("modalidad");
        }
        if (filtros.has("fechaFin")) {
          filter.fechaFin = { $lte: new Date(filtros.get("fechaFin")!) };
        }
      }
      return await this.eventoRepository.getAll(filter);
    } catch (err) {
      throw err;
    }
  }

  public async getEvento(id: string): Promise<Evento> {
    try {
      return await this.eventoRepository.getEvento(new Bson.ObjectId(id));
    } catch (err) {
      throw err;
    }
  }

  public async createEvento(payload: Evento): Promise<Bson.Document> {
    try {
      const evento: Evento = payload as Evento;
      evento.fechaCreacion = new Date(Date.now());
      evento.fechaInicio = new Date(evento.fechaInicio);
      evento.fechaFin = new Date(evento.fechaFin);
      const duracionMinima = this.duracionMinima(
        evento.fechaInicio,
        evento.fechaFin,
      );
      if (duracionMinima) {
        return await this.eventoRepository.createEvento(evento);
      } else {
        throw ERROR_DURACION_EVENTO;
      }
    } catch (err) {
      throw err;
    }
  }

  public async updateEvento<T extends Evento>(
    id: string,
    payload: T,
  ): Promise<Evento> {
    const eventoId = new Bson.ObjectId(id);
    const evento = await this.eventoRepository.getEvento(eventoId);
    if (payload.fechaInicio) evento.fechaInicio = new Date(payload.fechaInicio);
    if (payload.fechaFin) evento.fechaFin = new Date(payload.fechaFin);
    const duracionMinima = this.duracionMinima(
      evento.fechaInicio,
      evento.fechaFin,
    );
    if (duracionMinima) {
      const res = await this.eventoRepository.updateEvento(eventoId, payload);
      if (!res) throw new Error("El evento no se ha podido actualizar");
      return res;
    } else {
      throw ERROR_DURACION_EVENTO;
    }
  }

  public async deleteEvento(id: string) {
    try {
      await this.eventoRepository.deleteEvento(new Bson.ObjectId(id));
      return {
        _id: id,
        eliminado: true,
      };
    } catch (err) {
      throw err;
    }
  }

  public duracionMinima(dateA: Date, dateB: Date): boolean {
    const diferencia = dateB.getTime() - dateA.getTime();
    const dias = diferencia / 86400000;
    return dias >= 7;
  }
}
