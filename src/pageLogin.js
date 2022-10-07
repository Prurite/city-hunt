import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel }
  from 'react-bootstrap';
import { useAuth } from './AuthProvider';

export default function PageLogin() {
  return (<>
    <Form className="m-3" onSubmit={useAuth().onLogin}>
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