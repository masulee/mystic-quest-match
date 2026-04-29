import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AuthProvider = "google" | "instagram";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
  nickname?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  birthdate?: string; // ISO date string YYYY-MM-DD
  profileCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (provider: AuthProvider) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { nickname: string; gender: User["gender"]; birthdate: string }) => void;
}

export const calcAge = (birthdate?: string): number | undefined => {
  if (!birthdate) return undefined;
  const b = new Date(birthdate);
  if (Number.isNaN(b.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age;
};

const STORAGE_KEY = "threads_of_fate_user";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const mockUserFor = (provider: AuthProvider): User => {
  const id = `${provider}_${Math.random().toString(36).slice(2, 10)}`;
  if (provider === "google") {
    return {
      id,
      name: "여행자",
      email: "traveler@gmail.com",
      avatar: "🌙",
      provider,
      profileCompleted: false,
    };
  }
  return {
    id,
    name: "Dreamer",
    email: "dreamer@instagram",
    avatar: "✨",
    provider,
    profileCompleted: false,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (provider: AuthProvider): Promise<User> => {
    await new Promise((r) => setTimeout(r, 900)); // mock network
    const u = mockUserFor(provider);
    setUser(u);
    persist(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const updateProfile = useCallback(
    (data: { nickname: string; gender: User["gender"]; birthdate: string }) => {
      setUser((prev) => {
        if (!prev) return prev;
        const age = calcAge(data.birthdate);
        const next: User = { ...prev, ...data, age, profileCompleted: true };
        persist(next);
        return next;
      });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
