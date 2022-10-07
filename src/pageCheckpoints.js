import React from 'react';
import Parser from 'html-react-parser';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Alert, Button, Form, Image, InputGroup } from 'react-bootstrap';
const axios = require('axios');
const config = require('./config.json');

function CheckpointDetails (props) {
  function f(text, def) { // strong when not default
    return text === def ? text
      : "<strong>" + text + "</strong>";
  }
  const point = props.point;
  const dScores = [6, 5, 4, 3]; // default scores
  let desc = f(point.scores[0], dScores[0]);
  for (let i = 1; i < point.scores.length; i++)
    desc = desc + "/" + f(point.scores[i], dScores[i]);
  const images = point.images.map((value, index) => {
    return (
      <Image fluid key={value} src={config.static_image_path + value} />
    )
  })
  desc = desc + " " + point.desc;
  return (<div className="checkpointDetails box">
    <p>{Parser(desc)}</p>
    {props.images ? images : null}
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
      images: false,
      photo: false
    }
  }
  
  toggleImages() {
    this.setState({images: !this.state.images});
  }

  togglePhoto() {
    this.setState({photo: !this.state.photo});
  }

  render() {
    const point = this.props.point;
    const imagesButtonText = this.state.images
      ? "收起图片" : "展开图片";
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
        <p>
          <strong style={{marginRight: "1rem"}}>点位信息</strong>
          <Button variant="primary" id={"D" + point.id} onClick={() => { this.toggleImages() }}>
            {imagesButtonText}
          </Button>
        </p>
        <CheckpointDetails point={point} images={this.state.images} />
        <p />
        <p> <strong>当前通过人数</strong> {point.passed} </p>
        <p>
          <strong>我的打卡图片</strong> {photoAction}
          {this.state.photo ? <Image fluid src={config.upload_image_path + point.photo} /> : null}
        </p>
        <Form> <InputGroup>
          <Form.Control type="file" />
          <Button variant="primary" id={"B" + point.id} type="submit">
            {point.state ? "重新上传" : "上传"}
          </Button>
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
      <p>{Parser(group.desc)}</p>
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

function AlertList(props) {
  return (<>
    { props.alerts.map((value) => {
      return <Alert key={value} variant="primary" dismissible
        onClose={() => { props.removeAlert(value) }}>
          {value}
        </Alert>
    }) }
  </>)
}

export default class PageCheckpoints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: ["123", "456"]
    }
  }

  removeAlert(alert) {
    const newAlerts = this.state.alerts.filter((x) => (x != alert));
    this.setState({alerts: newAlerts});
  }

  render() {
    return (<div className='m-3'>
      <AlertList alerts={this.state.alerts} removeAlert={(x) => this.removeAlert(x)} />
      <CheckpointList list={this.props.list} />
    </div>)
  }
}