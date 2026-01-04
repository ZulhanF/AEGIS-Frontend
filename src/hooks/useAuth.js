import { useState, useCallback } from "react";
import {
  getAccessToken,
  getUserLogged,
  removeAccessToken,
  login as loginAPI,
  putAccessToken,
  register as registerAPI,
} from "@/utils/api";

// Custom hook untuk session autentikasi dan registrasi
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek apa sudah ada sesi di local
  const checkSession = useCallback(async () => {
    setIsLoading(true);

    const token = getAccessToken();

    if (token) {
      const { error, data } = await getUserLogged();

      console.log("getUserLogged response:", { error, data });

      if (!error && data) {
        // Cek status verifikasi user
        // Jika isVerified false, 0, atau null - logout user
        if (
          data.isVerified === false ||
          data.isVerified === 0 ||
          data.isVerified === null
        ) {
          console.log("User not verified, removing access");
          removeAccessToken();
          setUser(null);
          setError("Your account is pending admin approval.");
        } else {
          setUser(data);
        }
      } else {
        removeAccessToken();
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  // Login dengan api dari api.js
  const login = useCallback(async (email, password) => {
    setError(null);

    try {
      const { data } = await loginAPI({ email, password });

      console.log("Login response:", data);
      console.log(
        "isVerified value:",
        data.user?.isVerified,
        "type:",
        typeof data.user?.isVerified
      );

      // Validasi untuk isVerified
      // JANGAN simpan token jika user belum verified
      const isVerified = data.user?.isVerified;
      const role = data.user?.role;

      if (!isVerified && role !== "ADMIN") {
        const verificationError = new Error(
          "Your account is pending admin approval. Please wait for verification."
        );
        setError(verificationError.message);
        // JANGAN simpan token untuk user yang belum verified
        throw verificationError;
      }

      // Hanya sampai sini jika user sudah verified
      // Simpan token ke local storage
      putAccessToken(data.token);

      // Set user
      setUser(data.user);
      setError(null);

      // Return data untuk toast success message
      return data.user;
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      throw err; // Re-throw error agar toast.promise bisa menangkap
    }
  }, []);

  // Untuk hapus error karena kita simpan error di state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Logout user dan hapus token
  const logout = useCallback(() => {
    setUser(null);
    removeAccessToken();
    setError(null);
  }, []);

  // Register ambil api dari api.js dan error handling di sini
  const register = useCallback(async (name, username, email, password) => {
    setError(null);
    try {
      const { data } = await registerAPI({
        name,
        username,
        email,
        password,
      });

      setError(null);
      return data; // Return data untuk toast success
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      throw err; // Re-throw error agar toast.promise bisa menangkap
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    checkSession,
    login,
    clearError,
    logout,
    register,
  };
}
