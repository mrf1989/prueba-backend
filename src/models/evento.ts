import { Bson } from "../../deps.ts";

export interface Evento {
  _id?: Bson.ObjectID;
  nombre: string;
  descripcion: string;
  objetivoKm: number;
  fechaCreacion?: Date;
  fechaInicio: Date;
  fechaFin: Date;
  modalidad: Array<string>;
}
