import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Form, InputGroup, Col, Row, FloatingLabel }
  from 'react-bootstrap';
const axios = require('axios');
const config = require('./config.json');

// Usage: <PageSubmissions list={list} subs={subs} />
// list: the list of 

class SubmissionFilter extends React.Component {
  render() {
    const list = this.props.list;
    const states = {
      pending: "待审核",
      accepted: "已通过",
      denied: "未通过"
    };
    return (
      <Card className="p-3"> <Form>
        <Form.Group as={Row} className="mb-1" controlId="formGroupAreas">
          <Form.Label column sm={2}>打卡区域</Form.Label>
          <Col style={{alignSelf: "center"}}>
            {list.map((value, index) => {
              return <Form.Check defaultChecked inline type="checkbox"
                id={value.id} key={value.id} label={value.id + " " + value.name} />
            })}
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-1" controlId="formGroupStates">
          <Form.Label column sm={2}>状态</Form.Label>
          <Col style={{alignSelf: "center"}}>
            <Form.Check defaultChecked inline type="checkbox"
              id={"pending"} label={states["pending"]} />
            {["accepted", "denied"].map((value, index) => {
              return <Form.Check inline type="checkbox"
                id={value} key={value} label={states[value]} />
            })}
          </Col>
        </Form.Group>
        <Form.Group as={Row} style={{marginBottom: "0"}} className="mb-3" controlId="formGroupIds">
          <Col>
            <FloatingLabel
              controlId="floatingGroupQuery"
              label="组号"
            >
              <Form.Control type="text" placeholder="12210101" />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="floatingPointQuery"
              label="打卡点号"
            >
              <Form.Control type="text" placeholder="1-1" />
            </FloatingLabel>
          </Col>
        </Form.Group>
        <Button type="submit">过滤</Button>
      </Form> </Card>
    )
  }
}

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
    {sub.bonus != 0 ? `(+${sub.bonus})` : ""} </p>;
  const reason = sub.state != "denied" ? null
    : <p><strong>拒绝原因</strong> {sub.fail_reason} </p>;
  return (<Card className="my-3">
    <Card.Header>{ "组 " + sub.user + " 点 " + sub.checkpoint}</Card.Header>
    <Card.Img src={config.upload_image_path + sub.photo} style={{height: "18rem"}}/>
    <Card.Body>
      <p><strong>打卡时间</strong> {sub.uploaded_time}</p>
      <p><strong>状态</strong> {state}</p>
      {score}
      {reason}
      <Form>
        <InputGroup className="mb-3">
          <Form.Control placeholder="附加分" />
          <Button variant="success">通过</Button>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control placeholder="拒绝原因" />
          <Button variant="danger">拒绝</Button>
        </InputGroup>
      </Form>
    </Card.Body>
  </Card>)
}

export default function PageSubmissions(props) {
  return (<div className='m-3'>
    <SubmissionFilter list={props.list} />
    {props.subs.map((value, index) => {
      return <Submission id={value.id} key={value.id} sub={value} />;
    })}
  </div>)
}