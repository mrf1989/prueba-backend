import { Mandarine, Service } from "../../deps.ts";
import { UsuarioRepository } from "../repositories/repositories.ts";

@Service()
export class AuthService implements Mandarine.Security.Auth.UserDetailsService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  // Not working in MandarineTS v2.3.2 -> Proposal v.2.3.3 (https://github.com/mandarineorg/mandarinets/issues/305)
  public async loadUserByUsername(username: string) {
    const user: Mandarine.Types.UserDetails = await this.usuarioRepository
      .getUsuarioByUsername(username);
    return user;
  }
}
