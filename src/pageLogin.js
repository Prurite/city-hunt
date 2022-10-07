import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel }
  from 'react-bootstrap';
import { useAuth } from './AuthProvider';
const axios = require('axios');

export default function PageLogin({ }) {
  return (<>
    <Form className="m-3">
      <FloatingLabel controlId="floatingUsername" label="用户名"
        className="mb-3">
        <Form.Control type="text" placeholder="12210101" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="密码"
        className="mb-3">
        <Form.Control type="password" placeholder="password" />
      </FloatingLabel>
      <Button variant="primary" type="submit">登录</Button>
    </Form>
    <Button variant="success" onClick={useAuth().onLogin}>登录</Button>
  </>)
}