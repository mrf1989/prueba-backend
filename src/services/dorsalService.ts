import { Bson, Service } from "../../deps.ts";
import {
  DorsalRepository,
  EsfuerzoRepository,
  EventoRepository,
} from "../repositories/repositories.ts";
import { Dorsal, Evento } from "../models/models.ts";

const MAX_INSCRIPCIONES = 3;

@Service()
export class DorsalService {
  constructor(
    private readonly dorsalRepository: DorsalRepository,
    private readonly esfuerzoRepository: EsfuerzoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  public async getAllDorsales(
    _filtros: Map<string, string>,
  ): Promise<Dorsal[]> {
    try {
      const filter: Bson.Document = {};
      return await this.dorsalRepository.getAll(filter);
    } catch (err) {
      throw err;
    }
  }

  public async getDorsal(id: string): Promise<Dorsal> {
    try {
      return await this.dorsalRepository.getDorsal(new Bson.ObjectId(id));
    } catch (err) {
      throw err;
    }
  }

  public async createDorsal(payload: Dorsal): Promise<Bson.Document> {
    const dorsal: Dorsal = payload as Dorsal;
    const usuarioParticipante = (await this.dorsalRepository
      .getAll({
        "usuario_id": dorsal.usuario_id,
        "evento_id": dorsal.evento_id,
      })).length;
    const eventosId = (await this.dorsalRepository.getAll({
      "usuario_id": { $eq: dorsal.usuario_id },
    }))
      .map((dorsal) => dorsal.evento_id.toHexString());
    let eventosIncompletos = 0;

    if (eventosId.length >= MAX_INSCRIPCIONES) {
      const eventos = (await this.eventoRepository.getEventos(eventosId))
        .entries();

      while (eventosIncompletos < 3) {
        const evento: Evento = eventos.next().value;
        if (evento) {
          const dorsales = (await this.dorsalRepository.getAll({
            "evento_id": { $eq: evento._id! },
          }))
            .map((dorsal) => dorsal._id!.toHexString());
          const esfuerzosTotalesEnEvento = await this.esfuerzoRepository
            .getEsfuerzosTotales(dorsales);
          if (esfuerzosTotalesEnEvento < evento.objetivoKm) {
            eventosIncompletos++;
          }
        }
      }
    }

    const inscripcionesMinimas = (eventosId.length < MAX_INSCRIPCIONES) &&
      (eventosIncompletos < MAX_INSCRIPCIONES);

    if (!usuarioParticipante && inscripcionesMinimas) {
      try {
        const num = (await this.dorsalRepository.getAll({
          "evento_id": dorsal.evento_id,
        }))
          .length + 1;
        dorsal.num = num;
        return await this.dorsalRepository.createDorsal(dorsal);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error(
        "El usuario no cumple lo requisitos para inscribirse " +
          "o ya disponía de un dorsal para el evento",
      );
    }
  }

  public async updateDorsal<T extends Dorsal>(
    id: string,
    payload: T,
  ): Promise<Dorsal> {
    try {
      const dorsalId = new Bson.ObjectId(id);
      return await this.dorsalRepository.updateDorsal(dorsalId, payload);
    } catch (err) {
      throw err;
    }
  }
}
