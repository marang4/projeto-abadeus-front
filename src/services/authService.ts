import api from "./api";
import { cookieService } from "./cookieService";

export interface LoginRequest {
  email: string;
  senha: string;
  lembrarMe?: boolean;
}

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone?: string;
}

const COOKIE_USER_DATA = "user_data";
const COOKIE_AUTH_STATE = "auth_state";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthUser> {
    const response = await api.post<AuthUser>("/auth/login", credentials);
    this.setUserData(response.data, credentials.lembrarMe);
    return response.data;
  }

  async checkSession(): Promise<AuthUser | null> {
    try {
      const response = await api.get<AuthUser>("/auth/me");
      if (response.data) {
        this.setUserData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      this.clearUserData();
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao deslogar no servidor:", error);
    } finally {
      this.clearUserData();
    }
  }

  private setUserData(user: AuthUser, rememberMe?: boolean): void {
    const expires = rememberMe ? 30 : 1;
    cookieService.setObject(COOKIE_USER_DATA, user, { expires });
    cookieService.set(COOKIE_AUTH_STATE, "authenticated", { expires });
  }

  private clearUserData(): void {
    cookieService.remove(COOKIE_USER_DATA);
    cookieService.remove(COOKIE_AUTH_STATE);
  }

  getUserFromCookie(): AuthUser | null {
    return cookieService.getObject<AuthUser>(COOKIE_USER_DATA) || null;
  }
}

export const authService = new AuthService();
export default authService;