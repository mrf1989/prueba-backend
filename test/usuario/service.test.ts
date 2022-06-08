import { asserts, Bson, Rhum, Stubbed } from "../../deps.ts";
import { DBManagement } from "../../src/database/mongodb.ts";
import { UsuarioRepository } from "../../src/repositories/repositories.ts";
import { UsuarioService } from "../../src/services/services.ts";
import { Usuario } from "../../src/models/models.ts";

Rhum.testPlan("Testing Usuario Service", () => {
  let dbManagement: Stubbed<DBManagement>;
  const user: Usuario = {
    _id: new Bson.ObjectID("62358b4fac70f4b258326c48"),
    username: "mruano",
    password: "12345",
    rol: "admin",
    nombre: "Mario",
    apellidos: "Ruano Fernández",
    fechaNacimiento: new Date("1989-11-01"),
    email: "mruano@us.es",
    roles: ["ADMIN"],
    uid: "mruano",
    accountExpired: false,
    accountLocked: false,
    credentialsExpired: false,
    enabled: true,
  };
  let usuarioRepository: Stubbed<UsuarioRepository>;

  Rhum.beforeAll(() => {
    dbManagement = Rhum.stubbed(new DBManagement());
    dbManagement.stub("connect", () => {
      return 0;
    });
    dbManagement.stub("getCollection", () => {
      return 0;
    });
  });

  Rhum.testSuite("Operaciones CRUD en usuarios", () => {
    Rhum.beforeEach(() => {
      usuarioRepository = Rhum.stubbed(new UsuarioRepository(dbManagement));
    });

    Rhum.testCase("Permite crear un usuario", async () => {
      usuarioRepository.stub("getUsuarioByUsername", () => {
        throw new Error(`${user.username} no existe`);
      });

      usuarioRepository.stub("createUsuario", () => {
        return true;
      });

      const usuarioService = new UsuarioService(usuarioRepository);
      const res = await usuarioService.createUsuario(user);
      asserts.assertEquals(res, true);
    });

    Rhum.testCase("No permite crear usuario con username existente", () => {
      usuarioRepository.stub("getUsuarioByUsername", () => {
        return user;
      });

      const usuarioService = new UsuarioService(usuarioRepository);
      asserts.assertThrowsAsync(
        async () => {
          await usuarioService.createUsuario(user);
        },
        Error,
        `El username ${user.username} no está disponible`,
      );
    });

    Rhum.testCase("Actualiza la información de usuario", async () => {
      usuarioRepository.stub("getUsuario", () => {
        return user;
      });

      usuarioRepository.stub("updateUsuario", () => {
        return user;
      });

      const usuarioService = new UsuarioService(usuarioRepository);
      let res: Usuario | undefined;

      if (user._id) {
        res = await usuarioService.updateUsuario(
          user._id.id,
          { apellidos: "Ruano", ciudad: "Chipiona" } as Usuario,
        );
      }

      asserts.assertEquals(res, user);
    });

    Rhum.testCase("No actualiza información si no existe el usuario", () => {
      usuarioRepository.stub("getUsuario", () => {
        throw new Error("Usuario no encontrado");
      });

      const usuarioService = new UsuarioService(usuarioRepository);

      asserts.assertThrowsAsync(async () => {
        await usuarioService.updateUsuario(
          user._id!.id,
          { apellidos: "Ruano", ciudad: "Chipiona" } as Usuario,
        );
      });
    });

    Rhum.testCase(
      "Lista todos los usuarios registrados en el sistema",
      async () => {
        usuarioRepository.stub("getAll", () => {
          return [user, user, user];
        });

        const usuarioService = new UsuarioService(usuarioRepository);
        const usuarios = await usuarioService.getAllUsuarios();
        asserts.assertEquals(usuarios.length, 3);
      },
    );

    Rhum.testCase("Elimina un usuario registrado en el sistema", async () => {
      usuarioRepository.stub("deleteUsuario", () => {
        return 1;
      });

      const usuarioService = new UsuarioService(usuarioRepository);
      const res = await usuarioService.deleteUsuario(
        "62358b4fac70f4b258326c48",
      );
      asserts.assertEquals(res, {
        _id: new Bson.ObjectID("62358b4fac70f4b258326c48").toHexString(),
        eliminado: true,
      });
    });

    Rhum.testCase("Lanza error si se elimina un usuario que no existe", () => {
      usuarioRepository.stub("deleteUsuario", () => {
        throw new Error("Error en la eliminación del ususario");
      });

      const usuarioService = new UsuarioService(usuarioRepository);

      asserts.assertThrowsAsync(async () => {
        await usuarioService.deleteUsuario(user._id!.id);
      });
    });
  });
});

Rhum.run();
