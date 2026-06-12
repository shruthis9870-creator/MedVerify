import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  loginUser,
  requestLoginOtp,
  signupUser,
  verifyLoginOtp,
} from "../services/api";

const AuthContext = createContext();
const CURRENT_USER_KEY = "medverify_user";
const TOKEN_KEY = "medverify_token";

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem("role", nextUser.role);
    setToken(nextToken);
    setUser(nextUser);
    setRole(nextUser.role);
  };

  useEffect(() => {
    if (!token) return;

    let isCurrent = true;

    fetchCurrentUser(token)
      .then(({ user: freshUser }) => {
        if (!isCurrent) return;
        persistSession(token, freshUser);
      })
      .catch(() => {
        if (!isCurrent) return;
        logout();
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const login = (userRole, nextUser = null, nextToken = null) => {
    if (nextUser && nextToken) {
      persistSession(nextToken, nextUser);
      return;
    }

    localStorage.setItem("role", userRole);
    setRole(userRole);
  };

  const loginWithCredentials = async ({ role: expectedRole, email, password }) => {
    try {
      const data = await loginUser({
        role: expectedRole,
        email,
        password,
      });

      persistSession(data.token, data.user);

      return {
        ok: true,
        user: data.user,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || "Unable to login.",
      };
    }
  };

  const signup = async ({ role: nextRole, name, email, password, phone, specialty }) => {
    try {
      const data = await signupUser({
        role: nextRole,
        name,
        email,
        password,
        phone,
        specialty,
      });

      return {
        ok: true,
        user: data.user,
        verificationRequired: data.verification_required,
        otp: data.otp,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || "Unable to create account.",
      };
    }
  };

  const requestOtp = async ({ role: expectedRole, phone }) => {
    try {
      const data = await requestLoginOtp({
        role: expectedRole,
        phone,
      });

      return {
        ok: true,
        ...data,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || "Unable to request OTP.",
      };
    }
  };

  const verifyOtp = async ({ role: expectedRole, phone, otp }) => {
    try {
      const data = await verifyLoginOtp({
        role: expectedRole,
        phone,
        otp,
      });

      persistSession(data.token, data.user);

      return {
        ok: true,
        user: data.user,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || "Unable to verify OTP.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setRole(null);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        user,
        login,
        loginWithCredentials,
        signup,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
