import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form, FloatingLabel }
  from 'react-bootstrap';
const axios = require('axios');

export default function PageChangePassword(props) {
  const [err, setErr] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (form.newP.value !== form.confirmP.value)
      setErr("两次输入的密码不一致");
  }

  return (<>
    {err && <Alert className="m-3" variant="danger">{err.toString()}</Alert>}
    <Form className="m-3" onSubmit={handleSubmit}>
      <FloatingLabel controlId="floatingOldPassword" label="旧密码"
        className="mb-3">
        <Form.Control name="oldP" type="password" placeholder="password" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingNewPassword" label="新密码"
        className="mb-3">
        <Form.Control name="newP" type="password" placeholder="password" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingConfirmPassword" label="确认密码"
        className="mb-3">
        <Form.Control name="confirmP" type="password" placeholder="password" />
      </FloatingLabel>
      <Button variant="primary" type="submit">确认</Button>
      <Button variant="danger" className="mx-3">取消</Button>
    </Form>
  </>)
}