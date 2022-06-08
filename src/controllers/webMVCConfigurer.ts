import { Mandarine, Override } from "../../deps.ts";
import { AuthService } from "../services/services.ts";
import { PasswordEncoder } from "../utils/utils.ts";

@Override()
export class WebMvcConfigurer extends Mandarine.Native.WebMvcConfigurer {
  public authManagerBuilder(
    provider: Mandarine.Security.Auth.AuthenticationManagerBuilder,
  ) {
    const passwordEncoder = new PasswordEncoder();
    provider = provider
      .userDetailsService(AuthService)
      .passwordEncoder(passwordEncoder);
    return provider;
  }

  public httpLoginBuilder(
    provider: Mandarine.Security.Core.Modules.LoginBuilder,
  ) {
    provider
      .loginProcessingUrl("/api/login")
      //.loginSuccessUrl("/api/login-success")
      .loginUsernameParameter("username")
      .loginPasswordParameter("password")
      .logoutUrl("/api/logout")
      //.logoutSuccessUrl("/api/logout-success");
    return provider;
  }
}
