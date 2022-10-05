import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Button, Image } from 'react-bootstrap';

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

class CheckpointInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: false,
      photo: false
    }
  }

  toggleDetails() {
    this.setState({details: !this.state.details});
  }

  togglePhoto() {
    this.setState({photo: !this.state.photo});
  }

  render() {
    const point = this.props.point;
    const details = this.state.details
      ? <CheckpointDetails point={point} /> : null;
    const detailsButtonText = this.state.details
      ? "收起" : "展开";
    const photoButtonText = this.state.photo
      ? "收起" : "展开";
    const photoActions = point.photo
      ? <span>
          <button onClick={() => this.togglePhoto()}>{photoButtonText}</button>
          <button onClick={this.props.handleUpload}>重新上传</button>
        </span>
      : <button onClick={this.props.handleUpload}>上传</button>;
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
    return (<div className="checkpointInfo">
      <p>
        <strong>点位信息</strong>
        <button onClick={() => this.toggleDetails()}>{detailsButtonText}</button>
      </p>
      {details}
      <p> <strong>当前通过人数</strong> {this.props.point.passed} </p>
      <p>
        <strong>我的打卡图片</strong> {photoActions}
        {this.state.photo ? <img src={point.photo} /> : null}
      </p>
      {myTime}
      {myState}
    </div>)
  }
}

function CheckpointState (props) {
  const state = props.point.state;
  if (state === "pending")
    return <span className="checkpointState"><i className="fa fa-spinner" />待审核</span>;
  else if (state === "accepted")
    return <span className="checkpointState"><i className="fa fa-check" />已通过</span>;
  else if (state === "denied")
    return <span className="checkpointState"><i className="fa fa-times" />未通过</span>;
  else
    return <span className="checkpointState"><i className="fa fa-bars" />未打卡</span>
}

class Checkpoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleOpen() {
    this.setState({open: !this.state.open});
  }

  render() {
    const point = this.props.point;
    return (<div className="checkpoint">
      <div onClick={() => this.toggleOpen()}>
        <span>{point.id} {point.name}</span>
        <CheckpointState point={point} />
      </div>
      {this.state.open ? <CheckpointInfo point={point} /> : null}
    </div>);
  }
}

class CheckpointGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toogleCheckpoints() {
    this.setState({open: !this.state.open});
  }

  render() {
    const checkpoints = this.props.checkpointGroup.points.map((value, index) => {
      return <Checkpoint key={value.id} point={value} />;
    })
    return (<div className="checkpointGroup">
      <p onClick={() => this.toogleCheckpoints()}>
        {this.props.checkpointGroup.id} {this.props.checkpointGroup.name}
      </p>
      {this.state.open ? checkpoints : null}
    </div>)
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
const checkpointGroup = {
  "id": "1",
  "name": "SUSTech",
  "desc": "All points are in SUSTech",
  "points": [{
    "id": "1-1",
    "name": "Lecture Hall 1",
    "scores": [6, 5, 4, 3],
    "desc": "Take a photo as given",
    "images": ["1-1-1.jpg", "1-1-2.jpg"],
    "passed": 0, // Users that has submitted an accepted answer
    "state": "accepted", // or "accepted", "denied", null
    "uploaded_time": "", // An ISO string describing time or null
    "photo": "U12210101-P1-1.jpg", // or null
    "score": "0(+2)", // or null
    "fail_reason": "" // or a string containing reason
    // Read these 6 above from submissions
  }]
};
root.render(<CheckpointGroup checkpointGroup={checkpointGroup} />);
// root.render(<span><i className="fa fa-spinner" /></span>);