import {
  AllowOnly,
  Controller,
  DELETE,
  GET,
  POST,
  PUT,
  QueryParam,
  RequestBody,
  RouteParam,
} from "../../deps.ts";
import { EventoService } from "../services/services.ts";
import { Evento } from "../models/models.ts";

@Controller("/api")
export class EventoController {
  constructor(
    private readonly eventoService: EventoService,
  ) {}

  @GET("/eventos")
  public async getAllEventos(
    @QueryParam("objetivoKm") objetivoKm: string,
    @QueryParam("modalidad") modalidad: string,
    @QueryParam("fechaFin") fechaFin: string,
  ) {
    try {
      const filtros: Map<string, string> = new Map();
      if (objetivoKm) filtros.set("objetivoKm", objetivoKm);
      if (modalidad) filtros.set("modalidad", modalidad);
      if (fechaFin) filtros.set("fechaFin", fechaFin);
      return await this.eventoService.getAllEventos(filtros);
    } catch (err) {
      throw err;
    }
  }

  @GET("/eventos/:id")
  public async getEvento(@RouteParam("id") id: string) {
    try {
      return await this.eventoService.getEvento(id);
    } catch (err) {
      throw err;
    }
  }

  @PUT("/admin/eventos/:id")
  @AllowOnly("hasRole('ADMIN')")
  public async updateEvento<T extends Evento>(
    @RouteParam("id") id: string,
    @RequestBody() payload: T,
  ) {
    try {
      return await this.eventoService.updateEvento(id, payload);
    } catch (err) {
      throw err;
    }
  }

  @POST("/admin/eventos")
  @AllowOnly("hasRole('ADMIN')")
  public async createEvento(@RequestBody() payload: Evento) {
    try {
      return await this.eventoService.createEvento(payload);
    } catch (err) {
      throw err;
    }
  }

  @DELETE("/admin/eventos/:id")
  @AllowOnly("hasRole('ADMIN')")
  public async deleteEvento(@RouteParam("id") id: string) {
    try {
      return await this.eventoService.deleteEvento(id);
    } catch (err) {
      throw err;
    }
  }
}
