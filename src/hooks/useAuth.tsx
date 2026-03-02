import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { getToken, getMe, login as apiLogin, LoginResponse } from "@/lib/api";

export interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
  userType: string;
  dealershipId?: string | null;
  access?: string[];
  /** For employees: "admin" = created by admin (sees admin dashboard), "dealership" = dealer employee */
  createdByRole?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((res) => {
        const u = res.data;
        const authUser: AuthUser = {
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          userType: u.userType,
          dealershipId: u.dealershipId ?? null,
          access: Array.isArray(u.access) ? u.access : (u.employee?.access ? [...u.employee.access] : []),
        };
        setUser(authUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const res = await apiLogin(email, password);
    if (res.success && res.data?.token) {
      const t = res.data.token;
      const u = res.data.user;
      const authUser: AuthUser = {
        id: u?.id ?? "",
        email: u?.email,
        full_name: u?.full_name,
        userType: u?.userType ?? "user",
        dealershipId: (u as { dealershipId?: string })?.dealershipId ?? null,
        access: Array.isArray((u as { access?: string[] })?.access) ? (u as { access: string[] }).access : [],
        createdByRole: (u as { createdByRole?: string })?.createdByRole ?? null,
      };
      localStorage.setItem(AUTH_TOKEN_KEY, t);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      setToken(t);
      setUser(authUser);
    }
    return res;
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
