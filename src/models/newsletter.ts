import { Bson } from "../../deps.ts";

export interface Newsletter {
  _id: Bson.ObjectID;
  titulo: string;
  fecha: Date;
}
