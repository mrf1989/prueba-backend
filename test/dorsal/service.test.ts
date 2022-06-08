// deno-lint-ignore-file

import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import {
  DorsalRepository,
  EsfuerzoRepository,
  EventoRepository,
} from "../../src/repositories/repositories.ts";
import { DorsalService } from "../../src/services/services.ts";
import { Dorsal } from "../../src/models/models.ts";

Rhum.testPlan("Testing Dorsal Service", () => {
  let dbManagement: Stubbed<DBManagement>;
  const dorsal: Dorsal = {
    _id: new Bson.ObjectID("6235d572c077516a2dffa8ff"),
    lema: "Caminar para vencer",
    num: 34,
    usuario_id: new Bson.ObjectID("6235d572c077516a2dffa836"),
    evento_id: new Bson.ObjectID("6235d572c077516a2dffa823"),
  };
  let dorsalRepository: Stubbed<DorsalRepository>;
  let eventoRepository: Stubbed<EventoRepository>;
  let esfuerzoRepository: Stubbed<EsfuerzoRepository>;

  Rhum.beforeAll(() => {
    dbManagement = Rhum.stubbed(new DBManagement());
    dbManagement.stub("connect", () => {});
    dbManagement.stub("getCollection", () => {});
  });

  Rhum.testSuite("Operaciones CRUD en eventos", () => {
    Rhum.beforeEach(() => {
      dorsalRepository = Rhum.stubbed(new DorsalRepository(dbManagement));
      eventoRepository = Rhum.stubbed(new EventoRepository(dbManagement));
      esfuerzoRepository = Rhum.stubbed(new EsfuerzoRepository(dbManagement));
    });

    Rhum.testCase("Permite crear un dorsal", async () => {
      dorsalRepository.stub("getAll", () => {
        return [];
      });
      dorsalRepository.stub("createDorsal", () => {
        return new Bson.ObjectID("6235d572c077516a2dffa8ff");
      });

      const dorsalService = new DorsalService(
        dorsalRepository,
        esfuerzoRepository,
        eventoRepository,
      );
      const res = await dorsalService.createDorsal({
        lema: "A por todas!",
        usuario_id: "6235d572c077516a2dffa836",
        evento_id: "6235d572c077516a2dffa823",
      } as unknown as Dorsal);
      asserts.assertEquals(res, new Bson.ObjectID("6235d572c077516a2dffa8ff"));
    });
  });
});

Rhum.run();
