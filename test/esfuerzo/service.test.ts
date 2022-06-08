// deno-lint-ignore-file

import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import {
  DorsalRepository,
  EsfuerzoRepository,
  EventoRepository,
} from "../../src/repositories/repositories.ts";
import { EsfuerzoService } from "../../src/services/services.ts";
import { Dorsal, Esfuerzo, Evento } from "../../src/models/models.ts";

Rhum.testPlan("Testing Esfuerzo Service", () => {
  let dbManagement: Stubbed<DBManagement>;
  const evento: Evento = {
    _id: new Bson.ObjectID("6235d572c077516a2dffa823"),
    nombre: "Caminar para vencer",
    descripcion:
      "Descripción de la actividad deportiva y de la enfermedad contra la que se lucha",
    objetivoKm: 4700,
    fechaCreacion: new Date("2022-03-01"),
    fechaInicio: new Date("2022-03-01"),
    fechaFin: new Date("2022-03-10"),
    modalidad: ["caminata", "bicicleta"],
  };
  const evento2: Evento = {
    _id: new Bson.ObjectID("6235d572c077516a2dffa828"),
    nombre: "Caminar para vencer",
    descripcion:
      "Descripción de la actividad deportiva y de la enfermedad contra la que se lucha",
    objetivoKm: 700,
    fechaCreacion: new Date("2022-03-01"),
    fechaInicio: new Date("2022-03-01"),
    fechaFin: new Date("2022-03-10"),
    modalidad: ["caminata"],
  };
  const dorsal: Dorsal = {
    _id: new Bson.ObjectID("6235d572c077516a2dffa8ff"),
    lema: "Caminar para vencer",
    num: 34,
    usuario_id: new Bson.ObjectID("6235d572c077516a2dffa836"),
    evento_id: new Bson.ObjectID("6235d572c077516a2dffa823"),
  };
  const esfuerzo: Esfuerzo = {
    _id: new Bson.ObjectId("5535d572c077516a2dffa836"),
    numKm: 85,
    comentario: "Para ponerme a prueba!",
    modalidad: "bicicleta",
    usuario_id: new Bson.ObjectID("6235d572c077516a2dffa836"),
    dorsal_id: new Bson.ObjectID("6235d572c077516a2dffa8ff"),
  };

  let eventoRepository: Stubbed<EventoRepository>;
  let dorsalRepository: Stubbed<DorsalRepository>;
  let esfuerzoRepository: Stubbed<EsfuerzoRepository>;

  Rhum.beforeAll(() => {
    dbManagement = Rhum.stubbed(new DBManagement());
    dbManagement.stub("connect", () => {});
    dbManagement.stub("getCollection", () => {});
  });

  Rhum.testSuite("Operaciones de creación de esfuerzos", () => {
    Rhum.beforeEach(() => {
      eventoRepository = Rhum.stubbed(new EventoRepository(dbManagement));
      dorsalRepository = Rhum.stubbed(new DorsalRepository(dbManagement));
      esfuerzoRepository = Rhum.stubbed(new EsfuerzoRepository(dbManagement));
    });

    Rhum.testCase("Permite la creación de eventos", async () => {
      eventoRepository.stub("getEvento", () => {
        return evento;
      });
      dorsalRepository.stub("getDorsal", () => {
        return dorsal;
      });
      dorsalRepository.stub("getAll", () => {
        return [dorsal];
      });
      esfuerzoRepository.stub("getEsfuerzosTotales", () => {
        return 2456;
      });
      esfuerzoRepository.stub("createEsfuerzo", () => {
        return new Bson.ObjectId("5535d572c077516a2dffa836");
      });

      const esfuerzoService = new EsfuerzoService(
        esfuerzoRepository,
        dorsalRepository,
        eventoRepository,
      );
      const res = await esfuerzoService.createEsfuerzo(esfuerzo);
      asserts.assertEquals(res, new Bson.ObjectId("5535d572c077516a2dffa836"));
    });

    Rhum.testCase(
      "Limita la creación de esfuerzos para eventos completados",
      async () => {
        eventoRepository.stub("getEvento", () => {
          return evento;
        });
        dorsalRepository.stub("getDorsal", () => {
          return dorsal;
        });
        dorsalRepository.stub("getAll", () => {
          return [dorsal];
        });
        esfuerzoRepository.stub("getEsfuerzosTotales", () => {
          return 4642;
        });
        esfuerzoRepository.stub("createEsfuerzo", () => {});

        const esfuerzoService = new EsfuerzoService(
          esfuerzoRepository,
          dorsalRepository,
          eventoRepository,
        );
        asserts.assertThrowsAsync(
          async () => {
            await esfuerzoService.createEsfuerzo(esfuerzo);
          },
          Error,
          "No pueden realizarse más esfuerzos para un evento completado",
        );
      },
    );

    Rhum.testCase(
      "Evita creación de esfuerzos si no cumple con la/s modalidad/es",
      async () => {
        eventoRepository.stub("getEvento", () => {
          return evento2;
        });
        dorsalRepository.stub("getDorsal", () => {
          return dorsal;
        });
        dorsalRepository.stub("getAll", () => {
          return [dorsal];
        });
        esfuerzoRepository.stub("getEsfuerzosTotales", () => {
          return 123;
        });
        esfuerzoRepository.stub("createEsfuerzo", () => {});

        const esfuerzoService = new EsfuerzoService(
          esfuerzoRepository,
          dorsalRepository,
          eventoRepository,
        );
        asserts.assertThrowsAsync(
          async () => {
            await esfuerzoService.createEsfuerzo(esfuerzo);
          },
          Error,
          "No pueden realizarse esfuerzos en una modalidad no permitida en el evento",
        );
      },
    );
  });
});

Rhum.run();
