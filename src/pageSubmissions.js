import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form } from 'react-bootstrap';
const axios = require('axios');

function Submission(props) {
  const sub = props.sub;
  let state;
  if (sub.state === "accepted")
    state = "已通过";
  else if (sub.state === "denied")
    state = "已拒绝";
  else if (sub.state === "pending")
    state = "待审核";
  const score = sub.state != "accepted" ? null
    : <p><strong>得分</strong> {sub.score}
    + {sub.bonus != 0 ? `(+${sub.bonux}` : ""} </p>;
  return (<Card>
    <Card.Header>{sub.user + " " + sub.checkpoint}</Card.Header>
    <Card.Img src={sub.photo} />
    <Card.Body>
      <p><strong>打卡时间</strong> {sub.uploaded_time}</p>
      <p><strong>状态</strong> {state}</p>
      {score}
      <Form>
      </Form>
    </Card.Body>
  </Card>)
}