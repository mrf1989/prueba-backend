// deno-lint-ignore-file

import { Bson } from "../../deps.ts";

export interface Esfuerzo {
  _id?: Bson.ObjectID;
  numKm: number;
  fecha?: Date;
  comentario?: string;
  modalidad: string;
  usuario_id: Bson.ObjectID;
  dorsal_id: Bson.ObjectID;
}
