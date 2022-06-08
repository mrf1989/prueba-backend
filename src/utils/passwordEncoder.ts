import { createHash } from "../../deps.ts";
import type { Mandarine } from "../../deps.ts";

export class PasswordEncoder
  implements Mandarine.Security.Crypto.PasswordEncoder {
  encode(rawPassword: string): string {
    return createHash("sha3-256").update(rawPassword).toString();
  }

  matches(rawPassword: string, encodedPassword: string): boolean {
    const password = this.encode(rawPassword);
    return password == encodedPassword;
  }
}
