import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import throwError from "./AsyncError";

const config = require("./config.json");
const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
};

export function AuthProvider ({ children }) {
  const [uid, setUid] = React.useState(localStorage.getItem("uid"));
  const [type, setType] = React.useState(localStorage.getItem("type"));
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  
  if (token)
    axios.defaults.headers.common["Authorization"] = `bearer ${token}`;

  async function handleLogin(e) {
    e.preventDefault();
    const req = {
      username: e.target.username.value,
      password: e.target.password.value
    };
    axios.post(config.api_path + "/login", req)
      .then((res) => {
        console.log(res.data);
        const { uid, type, token, err_msg } = res.data;
        if (!uid)
          throw Error(err_msg);
        localStorage.setItem("uid", uid), setUid(uid);
        localStorage.setItem("type", type), setType(type);
        localStorage.setItem("token", token), setToken(token);
        axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
        navigate('/checkpoints');
      })
      .catch((err) => {
        throwError(err);
      })
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