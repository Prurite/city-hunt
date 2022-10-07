import React from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
};

function fakeAuth() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      uid: "12210101",
      type: "admin",
      token: "token"
    }), 250);
  })
}

export function AuthProvider ({ children }) {

  const [uid, setUid] = React.useState(localStorage.getItem("uid"));
  const [type, setType] = React.useState(localStorage.getItem("type"));
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  
  if (token)
    axios.defaults.headers.common["Authorization"] = `bearer ${token}`;

  async function handleLogin() {
    const {uid, type, token} = await fakeAuth();
    localStorage.setItem("uid", uid), setUid(uid);
    localStorage.setItem("type", type), setType(type);
    localStorage.setItem("token", token), setToken(token);
    axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
    navigate('/checkpoints');
  };

  function handleLogout() {
    localStorage.removeItem("uid"), setUid(null);
    localStorage.removeItem("type"), setType(null);
    localStorage.removeItem("token"), setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate('/login');
  };

  const value = {
    token, uid, type,
    onLogin: handleLogin,
    onLogout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function ProtectedRoute({ children, types = "" }) {
  const { uid, type } = useAuth();
  if (!uid)
    throw new Error("请登录。");
  if (types !== "" && !types.includes(type))
    throw new Error("您无权访问该页面。")
  return children;
}