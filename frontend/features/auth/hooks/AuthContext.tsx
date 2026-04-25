'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { fetchCurrentUser, logoutUser } from '@/features/auth/shared/auth.api';
import { AUTH_EXPIRED_EVENT } from '@/lib/http/apiFetch';
import type { AuthContextValue, AuthProviderProps, AuthUser } from '@/features/auth/types/auth.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchCurrentUser(controller.signal)
      .then((current) => setUser(current))
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  const login = useCallback((newUser: AuthUser) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    router.push(AUTH_ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      router.push(AUTH_ROUTES.LOGIN);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, [router]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
