import { useState, useCallback } from "react";

export const ADMIN_STORAGE_KEY = "peptidelab_admin_key";

export function useAdminAuth() {
  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem(ADMIN_STORAGE_KEY));
  });

  const handleLogin = useCallback(
    async (
      e: React.FormEvent,
      verifyAndLoad: (key: string) => Promise<void>,
    ) => {
      e.preventDefault();
      const trimmedKey = keyInput.trim();
      if (!trimmedKey) return;

      setIsLoadingAuth(true);
      setAuthError(null);
      try {
        await verifyAndLoad(trimmedKey);
        setAdminKey(trimmedKey);
        setIsAuthenticated(true);
        sessionStorage.setItem(ADMIN_STORAGE_KEY, trimmedKey);
      } catch (err: unknown) {
        setIsAuthenticated(false);
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setAuthError(
          err instanceof Error
            ? err.message
            : "Neispravan administratorski pristupni ključ.",
        );
      } finally {
        setIsLoadingAuth(false);
      }
    },
    [keyInput],
  );

  const handleLogout = useCallback((cleanup?: () => void) => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminKey("");
    setIsAuthenticated(false);
    setAuthError(null);
    setKeyInput("");
    cleanup?.();
  }, []);

  return {
    adminKey,
    setAdminKey,
    isAuthenticated,
    setIsAuthenticated,
    keyInput,
    setKeyInput,
    authError,
    setAuthError,
    isLoadingAuth,
    setIsLoadingAuth,
    handleLogin,
    handleLogout,
  };
}
