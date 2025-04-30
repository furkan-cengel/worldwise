import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case "logout":
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case "startLoading":
      return {
        ...state,
        loading: true,
      };
    default:
      throw new Error("Unknown action");
  }
}

const FAKE_USER = {
  name: "Furkan",
  email: "furkan@example.com",
  password: "qwerty",
  avatar:
    "https://media.licdn.com/dms/image/v2/D4D03AQGYCr3RE-1AeQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1683718553902?e=1750291200&v=beta&t=3-v-yb5g_9G_uc6skwX3Tn_pC8hEsSr8b8IbXftbftc",
  id: "1af16747-e458-4ccb-b086-4cc65e8a52b5",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, loading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    dispatch({ type: "startLoading" });
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
