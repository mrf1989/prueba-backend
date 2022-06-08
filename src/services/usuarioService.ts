import { Bson, Service } from "../../deps.ts";
import { UsuarioRepository } from "../repositories/repositories.ts";
import { Usuario } from "../models/models.ts";
import { PasswordEncoder } from "../utils/utils.ts";

@Service()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  public async getAllUsuarios() {
    return await this.usuarioRepository.getAll();
  }

  public async getUsuario(id: string) {
    try {
      return await this.usuarioRepository.getUsuario(new Bson.ObjectId(id));
    } catch (err) {
      throw err;
    }
  }

  public async createUsuario(payload: Usuario): Promise<Bson.Document> {
    const encoder = new PasswordEncoder();
    const nuevoUsuario = payload;
    nuevoUsuario.password = encoder.encode(nuevoUsuario.password);
    const username = nuevoUsuario.username;
    const existeUsuario = await this.existeUsuario(username);

    if (!existeUsuario) {
      try {
        const _id = new Bson.ObjectId();
        nuevoUsuario._id = _id;
        nuevoUsuario.uid = _id.toHexString();
        nuevoUsuario.roles = [nuevoUsuario.rol.toUpperCase()];
        nuevoUsuario.accountExpired = false;
        nuevoUsuario.accountLocked = false;
        nuevoUsuario.credentialsExpired = false;
        nuevoUsuario.enabled = true;
        return await this.usuarioRepository.createUsuario(nuevoUsuario);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error(`El username ${username} no está disponible`);
    }
  }

  public async updateUsuario<T extends Usuario>(
    id: string,
    payload: T,
  ): Promise<Usuario | undefined> {
    try {
      const usuario = await this.getUsuario(id);
      const res = await this.usuarioRepository.updateUsuario(
        usuario._id as Bson.ObjectID,
        payload,
      );
      if (res) return res;
    } catch (err) {
      throw err;
    }
  }

  public async deleteUsuario(id: string) {
    try {
      await this.usuarioRepository.deleteUsuario(new Bson.ObjectId(id));
      return {
        _id: id,
        eliminado: true,
      };
    } catch (err) {
      throw err;
    }
  }

  private async existeUsuario(username: string): Promise<boolean> {
    try {
      await this.usuarioRepository.getUsuarioByUsername(username);
      return true;
    } catch (_err) {
      return false;
    }
  }
}
