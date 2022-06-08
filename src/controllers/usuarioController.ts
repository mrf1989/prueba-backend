import {
  AllowOnly,
  AuthPrincipal,
  Controller,
  Cors,
  DELETE,
  GET,
  Mandarine,
  POST,
  PUT,
  RequestBody,
  ResponseParam,
  RouteParam,
} from "../../deps.ts";
import { UsuarioService } from "../services/services.ts";
import { Usuario } from "../models/models.ts";

@Controller("/api")
@Cors({
  origin: "*",
})
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
  ) {}

  @GET("/admin/usuarios")
  @AllowOnly("hasRole('ADMIN')")
  public async getAllUsuarios() {
    try {
      return await this.usuarioService.getAllUsuarios();
    } catch (err) {
      throw err;
    }
  }

  @GET("/usuarios/:id")
  public async getUsuario(@RouteParam("id") id: string) {
    try {
      return await this.usuarioService.getUsuario(id);
    } catch (err) {
      throw err;
    }
  }

  @PUT("/usuarios/:id")
  @AllowOnly("isAuthenticated()")
  public async updateUsuario<T extends Usuario>(
    @AuthPrincipal() principal: Mandarine.Types.UserDetails,
    @RouteParam("id") id: string,
    @RequestBody() payload: T,
  ) {
    if (principal.uid == id) {
      try {
        return await this.usuarioService.updateUsuario(id, payload);
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Usuario no autorizado");
    }
  }

  @POST("/usuarios")
  public async createUsuario(@RequestBody() payload: Usuario) {
    console.log("USER PAYLOAD:", payload);
    const usuario = payload as Usuario;
    return await this.usuarioService.createUsuario(usuario);
  }

  @DELETE("/admin/usuarios/:id")
  @AllowOnly("hasRole('ADMIN')")
  public async deleteUsuario(@RouteParam("id") id: string) {
    const res = await this.usuarioService.deleteUsuario(id);
    return JSON.stringify(res);
  }

  @GET("/login")
  public loginUsuarioSuccess() {
    console.log("HELLO WORLD!");
  }

  @GET("/logout-success")
  public logoutUsuarioSuccess() {
    console.log(`Logout success. Bye!`);
  }
}
