import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { EventoRepository } from "../../src/repositories/repositories.ts";
import { EventoService } from "../../src/services/services.ts";
import { Evento } from "../../src/models/models.ts";

Rhum.testPlan("Testing Evento Service", () => {
  let dbManagement: Stubbed<DBManagement>;
  const evento: Evento = {
    _id: new Bson.ObjectId("6235d572c077516a2dffa8ff"),
    nombre: "Caminar para vencer",
    descripcion:
      "Descripción de la actividad deportiva y de la enfermedad contra la que se lucha",
    objetivoKm: 5000,
    fechaCreacion: new Date("2022-03-01"),
    fechaInicio: new Date("2022-03-01"),
    fechaFin: new Date("2022-03-10"),
    modalidad: ["caminata", "carrera"],
  };
  let eventoRepository: Stubbed<EventoRepository>;

  Rhum.beforeAll(() => {
    dbManagement = Rhum.stubbed(new DBManagement());
    dbManagement.stub("connect", () => {});
    dbManagement.stub("getCollection", () => {});
  });

  Rhum.testSuite("Operaciones CRUD en eventos", () => {
    Rhum.beforeEach(() => {
      eventoRepository = Rhum.stubbed(new EventoRepository(dbManagement));
    });

    Rhum.testCase("Permite crear un evento", async () => {
      eventoRepository.stub("createEvento", () => {
        return evento._id;
      });

      const eventoService = new EventoService(eventoRepository);
      const res = await eventoService.createEvento(evento);
      asserts.assertEquals(res, new Bson.ObjectId("6235d572c077516a2dffa8ff"));
    });

    Rhum.testCase("Valida la duración mínima de un evento", () => {
      evento.fechaFin = new Date("2022-03-03");

      const eventoService = new EventoService(eventoRepository);
      asserts.assertThrowsAsync(
        async () => {
          await eventoService.createEvento(evento);
        },
        Error,
        "El evento debe durar un mínimo de 7 días",
      );
    });

    Rhum.testCase("Listar todos los eventos", async () => {
      eventoRepository.stub("getAll", () => {
        return [evento, evento, evento];
      });

      const eventoService = new EventoService(eventoRepository);
      const filter = new Map();
      const eventos = await eventoService.getAllEventos(filter);
      asserts.assertEquals(eventos.length, 3);
    });

    Rhum.testCase("Actualiza la información de evento", async () => {
      eventoRepository.stub("getEvento", () => {
        return evento;
      });
      eventoRepository.stub("updateEvento", () => true);
      const eventoService = new EventoService(eventoRepository);
      const nuevosDatos = {
        nombre: "Caminar para vencer 2022",
        objetivoKm: 8000,
        fechaFin: "2022-03-20",
      };
      const res = await eventoService.updateEvento(
        evento._id!.id,
        nuevosDatos as unknown as Evento,
      );

      asserts.assertEquals(res, true);
    });

    Rhum.testCase("No actualiza evento por duración no válida", () => {
      eventoRepository.stub("getEvento", () => {
        return evento;
      });
      eventoRepository.stub("updateEvento", () => true);
      const eventoService = new EventoService(eventoRepository);
      const nuevosDatos = {
        nombre: "Caminar para vencer 2022",
        fechaInicio: "2022-03-15",
        fechaFin: "2022-03-20",
      };

      asserts.assertThrowsAsync(
        async () => {
          await eventoService.updateEvento(
            evento._id!.id,
            nuevosDatos as unknown as Evento,
          );
        },
        Error,
        "El evento debe durar un mínimo de 7 días",
      );
    });
  });
});

Rhum.run();
