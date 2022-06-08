import { Bson, Service } from "../../deps.ts";
import { ArticuloRepository } from "../repositories/repositories.ts";
import { Articulo } from "../models/models.ts";

@Service()
export class ArticuloService {
  constructor(private readonly articuloRepository: ArticuloRepository) {}

  public async getAllArticulos(): Promise<Articulo[]> {
    try {
      return await this.articuloRepository.getAll();
    } catch (err) {
      throw err;
    }
  }

  public async getArticulo(id: string): Promise<Articulo> {
    try {
      return await this.articuloRepository.getArticulo(new Bson.ObjectId(id));
    } catch (err) {
      throw err;
    }
  }

  public async createArticulo(payload: Articulo): Promise<Bson.Document> {
    try {
      return await this.articuloRepository.createArticulo(payload);
    } catch (err) {
      throw err;
    }
  }

  public async updateArticulo<T extends Articulo>(
    id: string,
    payload: T,
  ): Promise<Articulo> {
    try {
      const articulo = await this.getArticulo(id);
      const res = await this.articuloRepository.updateArticulo(
        articulo._id as Bson.ObjectID,
        payload,
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  public async deleteArticulo(id: string) {
    try {
      await this.articuloRepository.deleteArticulo(new Bson.ObjectId(id));
      return {
        _id: id,
        eliminado: true,
      };
    } catch (err) {
      throw err;
    }
  }
}
