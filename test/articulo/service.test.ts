// deno-lint-ignore-file

import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { ArticuloRepository } from "../../src/repositories/repositories.ts";
import { ArticuloService } from "../../src/services/services.ts";
import { Articulo } from "../../src/models/models.ts";

Rhum.testPlan("Testing Articulo Service", () => {
  let dbManagement: Stubbed<DBManagement>;
  const articulo: Articulo = {
    _id: new Bson.ObjectId("6297c7784b0dd585cea1163c"),
    titulo: "Artículo de prueba",
    subtitulo: "El subtítulo del artículo de prueba",
    fecha: new Date("2022-03-31"),
    cuerpo: "Lorem ipsum...",
    categoria: "noticia",
    usuario_id: new Bson.ObjectID("6235d572c077516a2dffa8ff"),
  };
  let articuloRepository: Stubbed<ArticuloRepository>;

  Rhum.beforeAll(() => {
    dbManagement = Rhum.stubbed(new DBManagement());
    dbManagement.stub("connect", () => {});
    dbManagement.stub("getCollection", () => {});
  });

  Rhum.testSuite("Operaciones CRUD en artículos", () => {
    Rhum.beforeEach(() => {
      articuloRepository = Rhum.stubbed(new ArticuloRepository(dbManagement));
    });

    Rhum.testCase("Permite crear un artículo", async () => {
      articuloRepository.stub("createArticulo", () => {
        return "6297c7784b0dd585cea1163c";
      });

      const articuloService = new ArticuloService(articuloRepository);
      const res = await articuloService.createArticulo(articulo);
      asserts.assertEquals(res, "6297c7784b0dd585cea1163c");
    });

    Rhum.testCase("Actualiza un artículo", async () => {
      articuloRepository.stub("updateArticulo", () => {
        const articuloEditado = articulo;
        articuloEditado.titulo = "Título editado";
        return articuloEditado;
      });
      articuloRepository.stub("getArticulo", () => {
        return articulo;
      });

      const articuloService = new ArticuloService(articuloRepository);
      const articuloEditado = articulo;
      articuloEditado.titulo = "Título editado";
      const res = await articuloService.updateArticulo(
        "6235d572c077516a2dffa8ff",
        articuloEditado,
      );
      asserts.assertEquals(res, articuloEditado);
    });

    Rhum.testCase("Listar todos los artículos", async () => {
      articuloRepository.stub("getAll", () => {
        return [articulo, articulo, articulo];
      });

      const articuloService = new ArticuloService(articuloRepository);
      const articulos = await articuloService.getAllArticulos();
      asserts.assertEquals(articulos.length, 3);
    });
  });
});

Rhum.run();
