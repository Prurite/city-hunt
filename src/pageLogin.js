import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form, FloatingLabel }
  from 'react-bootstrap';
import axios from 'axios';
import handleAxiosError from './AxiosError';
const config = require("./config.json");

export default function PageLogin() {
  const [error, setError] = React.useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    const req = {
      uid: e.target.uid.value,
      password: e.target.password.value
    };
    axios.post(config.api_path + "/login", req)
      .then((res) => {
        const { uid, type, token } = res.data;
        setError(null);
        localStorage.setItem("uid", uid);
        localStorage.setItem("type", type);
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
        window.location.replace('/checkpoints');
      })
      .catch((err) => {
        setError(handleAxiosError(err));
      })
  };

  return (<>
    {error && <Alert variant="danger" className="m-3">{error.toString()}</Alert>}
    <Form className="m-3" onSubmit={handleLogin}>
      <FloatingLabel controlId="floatingUid" label="用户名"
        className="mb-3">
        <Form.Control name="uid" type="text" placeholder="12210101" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="密码"
        className="mb-3">
        <Form.Control name="password" type="password" placeholder="password" />
      </FloatingLabel>
      <Button variant="primary" type="submit">登录</Button>
    </Form>
  </>)
}