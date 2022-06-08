import { Bson, Collection, Component, Database } from "../../deps.ts";
import { DBManagement } from "../database/mongodb.ts";
import { Usuario } from "../models/models.ts";

@Component()
export class UsuarioRepository {
  private db!: Database;
  private usuarios!: Collection<Usuario>;

  constructor(private readonly storage: DBManagement) {
    this.init();
  }

  private async init() {
    this.db = await this.storage.connect();
    this.usuarios = this.storage.getCollection("usuarios", this.db);
  }

  public async getAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarios.find({}, {
      noCursorTimeout: false,
      projection: {
        "password": 0,
        "uid": 0,
        "roles": 0,
        "accountExpired": 0,
        "accountLocked": 0,
        "credentialsExpired": 0,
        "enabled": 0,
      },
    }).toArray();
    if (!usuarios) throw new Error("No se encuentran usuarios");
    return usuarios;
  }

  public async getUsuario(id: Bson.ObjectID): Promise<Usuario> {
    const usuario = await this.usuarios.findOne({ "_id": id }, {
      noCursorTimeout: false,
      projection: {
        "password": 0,
        "uid": 0,
        "roles": 0,
        "accountExpired": 0,
        "accountLocked": 0,
        "credentialsExpired": 0,
        "enabled": 0,
      },
    });
    if (!usuario) throw new Error("Usuario no encontrado");
    return usuario;
  }

  public async getUsuarioByUsername(username: string): Promise<Usuario> {
    const usuario = await this.usuarios.findOne({ "username": username }, {
      noCursorTimeout: false,
    });
    if (!usuario) throw new Error(`${username} no existe`);
    return usuario;
  }

  public async createUsuario(usuario: Usuario) {
    const res = await this.usuarios.insertOne(usuario);
    if (!res) throw new Error("Error en la creación del usuario");
    return res;
  }

  public async updateUsuario<T extends Usuario>(id: Bson.ObjectID, payload: T) {
    const res = await this.usuarios.updateOne(
      { "_id": id },
      { $set: payload },
      { upsert: true },
    );
    if (res.modifiedCount != 1) {
      throw new Error("Error en la actualización del usuario");
    }
    return await this.getUsuario(id);
  }

  public async deleteUsuario(id: Bson.ObjectID) {
    const res = await this.usuarios.deleteOne({ "_id": id });
    if (!res) throw new Error("Error en la eliminación del ususario");
    return res;
  }
}
