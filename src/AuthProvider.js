import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const config = require("./config.json");
const AuthContext = React.createContext(null);

export function useAuth() {
  return React.useContext(AuthContext);
};

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: localStorage.getItem("uid"),
      type: localStorage.getItem("type"),
      token: localStorage.getItem("token"),
      onLogout: this.handleLogout
    }
    if (this.state.token)
      axios.defaults.headers.common["Authorization"] = `bearer ${this.state.token}`;
  }

  handleLogout = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("type");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    this.setState({
      uid: null, type: null, token: null
    });
    window.location.replace('/login');
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
};

export function ProtectedRoute({ children, types = "" }) {
  const { uid, type } = useAuth();
  if (!uid)
    throw new Error("请登录。");
  if (types !== "" && !types.includes(type))
    throw new Error("您无权访问该页面。")
  return children;
}