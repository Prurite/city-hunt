import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form, FloatingLabel }
  from 'react-bootstrap';
import axios from 'axios';
const config = require("./config.json");

export default function PageLogin() {
  const [error, setError] = React.useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    const req = {
      username: e.target.username.value,
      password: e.target.password.value
    };
    axios.post(config.api_path + "/login", req)
      .then((res) => {
        const { uid, type, token, err_msg } = res.data;
        if (!uid)
          setError(err_msg);
        else {
          setError(null);
          localStorage.setItem("uid", uid);
          localStorage.setItem("type", type);
          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
          window.location.replace('/checkpoints');
        }
      })
      .catch((err) => {
        setError(err);
      })
  };

  return (<>
    {error && <Alert variant="danger" className="m-3">{error}</Alert>}
    <Form className="m-3" onSubmit={handleLogin}>
      <FloatingLabel controlId="floatingUsername" label="用户名"
        className="mb-3">
        <Form.Control
          name="username"
          type="text" placeholder="12210101" 
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="密码"
        className="mb-3">
        <Form.Control
          name="password"
          type="password" placeholder="password"
        />
      </FloatingLabel>
      <Button variant="primary" type="submit">登录</Button>
    </Form>
  </>)
}