import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER FROM LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = (data) => {
    if (!data?.user || !data?.accessToken) {
      return false;
    }

    setUser(data.user);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    if (data.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );
    } else {
      localStorage.removeItem("refreshToken");
    }

    return true;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAuth = () => {
  return useContext(AuthContext);
};