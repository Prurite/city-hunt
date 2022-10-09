import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form, FloatingLabel }
  from 'react-bootstrap';
import { useAuth } from "./AuthProvider";
import handleApiError from './AxiosError';
import axios from 'axios';
const config = require("./config.json")

export default function PageChangePassword(props) {
  const [err, setErr] = React.useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (form.newP.value !== form.confirmP.value) {
      setErr("两次输入的密码不一致");
      window.scrollTo(0, 0);
      return;
    }
    const data = {
      uid: form.uid.value,
      old_password: form.oldP.value,
      new_password: form.newP.value
    };
    axios.post(config.api_path + "/changepassword", data)
      .then((res) => {
        setErr(null);
        console.log(res.data);
        console.log(res.data.message);
        if (res.data.message)
          alert(res.data.message);
      })
      .catch((err) => {
        setErr(handleApiError(err));
      })
  }

  return (<>
    {err && <Alert className="m-3" variant="danger">{err.toString()}</Alert>}
    <Form className="m-3" onSubmit={handleSubmit}>
      <FloatingLabel controlId="floatingUid" label="UID"
        className="mb-3">
        <Form.Control name="uid" type="text" placeholder="12210101"
          defaultValue={useAuth().uid}/>
      </FloatingLabel>
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