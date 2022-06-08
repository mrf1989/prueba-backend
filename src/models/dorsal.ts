// deno-lint-ignore-file

import { Bson } from "../../deps.ts";

export interface Dorsal {
  _id?: Bson.ObjectID;
  num?: number;
  lema?: string;
  usuario_id: Bson.ObjectID;
  evento_id: Bson.ObjectID;
}
