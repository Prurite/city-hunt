import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Button, Form, Image, InputGroup } from 'react-bootstrap';
import { MyNavbar } from './CityhuntNavbar';
const axios = require('axios');

function CheckpointDetails (props) {
  const point = props.point;
  let desc = point.scores[0];
  for (let i = 1; i < point.scores.length; i++)
    desc = desc + "/" + point.scores[i];
  const images = point.images.map((value, index) => {
    return (
      <Image key={value} src={value} />
    )
  })
  desc = desc + " " + point.desc;
  return (<div className="checkpointDetails box">
    <p>{desc}</p>
    {images}
  </div>);
}

function CheckpointState (props) {
  const state = props.point.state;
  if (state === "pending")
    return <span className="checkpointState"><i className="fa fa-spinner" /> 待审核</span>;
  else if (state === "accepted")
    return <span className="checkpointState"><i className="fa fa-check" /> 已通过</span>;
  else if (state === "denied")
    return <span className="checkpointState"><i className="fa fa-times" /> 未通过</span>;
  else
    return <span className="checkpointState"><i className="fa fa-bars" /> 未打卡</span>
}

class Checkpoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: false
    }
  }
  
  togglePhoto() {
    this.setState({photo: !this.state.photo});
  }

  render() {
    const point = this.props.point;
    const detailsButtonText = this.state.details
      ? "收起" : "展开";
    const photoButtonText = this.state.photo
      ? "收起" : "展开";
    const photoAction = !point.photo ? null
      : <Button variant="primary" onClick={() => this.togglePhoto()}>
          {photoButtonText}
        </Button>;
    const myTime = point.uploaded_time
      ? <p><strong>我的打卡时间</strong> {point.uploaded_time}</p>
      : null;
    let myState = null;
    if (point.state === "pending")
      myState = <p> <strong>我的预计得分</strong> {point.score} </p>
    else if (point.state === "accepted")
      myState = <p> <strong>我的得分</strong> {point.score} </p>
    else if (point.state === "denied")
      myState = <p> <strong>我的不通过原因</strong> {point.fail_reason} </p>
    return (<Accordion.Item eventKey={"P" + point.id}>
      <Accordion.Header><div style={{width: "100%", marginRight: "10px"}}>
        {point.id} {point.name} <CheckpointState point={point} />
      </div></Accordion.Header>
      <Accordion.Body>
        <Accordion>
          <Accordion.Header>点位信息</Accordion.Header>
          <Accordion.Body><CheckpointDetails point={point} /></Accordion.Body>
        </Accordion>
        <p />
        <p> <strong>当前通过人数</strong> {point.passed} </p>
        <p>
          <strong>我的打卡图片</strong> {photoAction}
          {this.state.photo ? <Image src={point.photo} /> : null}
        </p>
        <Form> <InputGroup>
          <Form.Control type="file" />
          <Button variant="primary" id={"B" + point.id} type="submit">上传</Button>
        </InputGroup> </Form>
        <p />
        {myTime}
        {myState}
      </Accordion.Body>
    </Accordion.Item>)
  }
}

function CheckpointGroup (props) {
  const group = props.group;
  const checkpoints = group.points.map((value, index) => {
    return <Checkpoint key={value.id} point={value} />;
  })
  return (<Accordion.Item eventKey={"G" + group.id}>
    <Accordion.Header>{group.id} {group.name}</Accordion.Header>
    <Accordion.Body>
      <p>{group.desc}</p>
      <Accordion>
        {checkpoints}
      </Accordion>
    </Accordion.Body>
  </Accordion.Item>);
}

function CheckpointList (props) {
  const checkpointGroups = props.list.map((value, index) => {
    return <CheckpointGroup key={value.id} group={value} />;
  })
  return <Accordion>{checkpointGroups}</Accordion>;
}

export function PageCheckpoints (props) {
  return (<>
    <MyNavbar />
    <CheckpointList list={props.list} />
  </>)
}