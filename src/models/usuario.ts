import { Bson, Mandarine } from "../../deps.ts";

export interface Usuario extends Mandarine.Security.Auth.UserDetails {
  _id?: Bson.ObjectID;
  username: string;
  password: string;
  rol: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: Date;
  email: string;
  telefono?: string;
  ciudad?: string;
}
