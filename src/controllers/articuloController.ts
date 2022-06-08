import {
  AllowOnly,
  Bson,
  Controller,
  DELETE,
  GET,
  POST,
  PUT,
  RequestBody,
  RouteParam,
} from "../../deps.ts";
import { ArticuloService } from "../services/services.ts";
import { Articulo } from "../models/models.ts";

@Controller("/api")
export class ArticuloController {
  constructor(
    private readonly articuloService: ArticuloService,
  ) {}

  @GET("/articulos")
  public async getAllArticulos() {
    try {
      return await this.articuloService.getAllArticulos();
    } catch (err) {
      throw err;
    }
  }

  @GET("/articulos/:id")
  public async getArticulo(@RouteParam("id") id: string) {
    try {
      return await this.articuloService.getArticulo(id);
    } catch (err) {
      throw err;
    }
  }

  @POST("/admin/articulos")
  @AllowOnly("hasRole('ADMIN')")
  public async createArticulo(
    @RequestBody() payload: Articulo,
  ) {
    try {
      const articulo = payload as Articulo;
      articulo.usuario_id = new Bson.ObjectId(articulo.usuario_id);
      return await this.articuloService.createArticulo(articulo);
    } catch (err) {
      throw err;
    }
  }

  @PUT("/admin/articulos/:id")
  @AllowOnly("hasRole('ADMIN')")
  public async updateArticulo<T extends Articulo>(
    @RouteParam("id") id: string,
    @RequestBody() payload: T,
  ) {
    try {
      return await this.articuloService.updateArticulo(id, payload);
    } catch (err) {
      throw err;
    }
  }

  @DELETE("/admin/articulos/:id")
  @AllowOnly("hasRole('ADMIN')")
  public async deleteArticulo(
    @RouteParam("id") id: string,
  ) {
    try {
      return await this.articuloService.deleteArticulo(id);
    } catch (err) {
      throw err;
    }
  }
}
