import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export type AuthProvider = "google" | "instagram" | "email";

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
  snsUrl?: string;
  profileCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithOAuth: (provider: "google") => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { nickname: string; gender: User["gender"]; birthdate: string; snsUrl?: string }) => Promise<void>;
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

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const buildUserFromSupabase = async (sUser: {
  id: string;
  email?: string | null;
  user_metadata?: any;
  app_metadata?: any;
}): Promise<User> => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, gender, birthdate, age, avatar_url, profile_completed, provider, sns_url")
    .eq("id", sUser.id)
    .maybeSingle();

  const meta = sUser.user_metadata ?? {};
  const providerRaw =
    (profile?.provider as string | undefined) ??
    (sUser.app_metadata?.provider as string | undefined) ??
    "email";
  const provider: AuthProvider =
    providerRaw === "google" ? "google" : providerRaw === "instagram" ? "instagram" : "email";

  return {
    id: sUser.id,
    name: profile?.nickname ?? meta.full_name ?? meta.name ?? sUser.email?.split("@")[0] ?? "여행자",
    email: sUser.email ?? "",
    avatar: profile?.avatar_url ?? meta.avatar_url ?? "✨",
    provider,
    nickname: profile?.nickname ?? undefined,
    gender: (profile?.gender as User["gender"]) ?? undefined,
    age: profile?.age ?? undefined,
    birthdate: profile?.birthdate ?? undefined,
    snsUrl: (profile as any)?.sns_url ?? undefined,
    profileCompleted: profile?.profile_completed ?? false,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Defer to avoid deadlocks
        setTimeout(() => {
          buildUserFromSupabase(session.user).then(setUser).catch(() => {});
        }, 0);
      } else {
        setUser(null);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        buildUserFromSupabase(session.user).then(setUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const loginWithOAuth = useCallback(async (provider: "google") => {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + "/login",
    });
    if (result.error) throw result.error;
    // If redirected, browser leaves the page; otherwise session is set and listener fires.
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data: { nickname: string; gender: User["gender"]; birthdate: string; snsUrl?: string }) => {
      if (!user) return;
      const age = calcAge(data.birthdate);
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname: data.nickname,
          gender: data.gender as any,
          birthdate: data.birthdate,
          age,
          sns_url: data.snsUrl ?? null,
          profile_completed: true,
        } as any)
        .eq("id", user.id);
      if (error) throw error;
      setUser({ ...user, ...data, age, profileCompleted: true });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginWithOAuth,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
