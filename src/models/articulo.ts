// deno-lint-ignore-file

import { Bson } from "../../deps.ts";

export interface Articulo {
  _id?: Bson.ObjectID;
  titulo: string;
  subtitulo: string;
  fecha: Date;
  cuerpo: string;
  categoria: string;
  referencia?: string;
  enlaceImagen?: string;
  usuario_id: Bson.ObjectID;
}
