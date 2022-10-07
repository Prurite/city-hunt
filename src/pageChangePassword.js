import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FloatingLabel }
  from 'react-bootstrap';
const axios = require('axios');

export default function PageChangePassword(props) {
  return (<>
    <Form className="m-3">
      <FloatingLabel controlId="floatingOldPassword" label="旧密码"
        className="mb-3">
        <Form.Control type="password" placeholder="password" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingNewPassword" label="新密码"
        className="mb-3">
        <Form.Control type="password" placeholder="password" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingNewPassword" label="确认密码"
        className="mb-3">
        <Form.Control type="password" placeholder="password" />
      </FloatingLabel>
      <Button variant="primary" type="submit">确认</Button>
      <Button variant="danger" className="mx-3">取消</Button>
    </Form>
  </>)
}