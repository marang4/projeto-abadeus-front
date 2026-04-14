import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
// Atenção: Verifica se o caminho para o teu authService está correto aqui!
import {
  authService,
  type AuthUser,
  type LoginRequest,
} from "../services/authService";

interface AuthContextType {
  usuario: AuthUser | null;
  user: AuthUser | null; // Alias para compatibilidade
  estaAutenticado: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    try {
      const user = await authService.checkSession();
      setUsuario(user);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = authService.getUserFromCookie();
    if (cached) setUsuario(cached);
    check();
  }, [check]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const user = await authService.login(credentials);
    setUsuario(user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        user: usuario,
        estaAutenticado: !!usuario,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
