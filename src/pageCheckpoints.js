import React from "react";
import Parser from "html-react-parser";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Alert, Button, Form, Image, InputGroup } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import handleApiError from "./AxiosError";

const config = require("./config.json");
const socket = io({ path: config.api_path + "/socket.io", transports: ['websocket'] });

// Render the details (score, description, images) of a checkpoint
function CheckpointDetails ({ point, show_images }) {
  // Strong the text when it's not the default value
  function f(text, def) {
    return text === def ? text
      : "<strong>" + text + "</strong>";
  }

  const dScores = config.default_scores; // default scores

  // Display the scores
  let desc = f(point.scores[0], dScores[0]);
  for (let i = 1; i < point.scores.length; i++)
    desc = desc + "/" + f(point.scores[i], dScores[i]);

  // Display the description
  desc = desc + " " + point.desc;

  // Render the images
  const images = point.images.map((value, index) => {
    return (
      <Image fluid key={value} src={config.static_image_path + "/" + value} />
    )
  })

  return (<div className="checkpointDetails box">
    <p>{Parser(desc)}</p>
    {show_images ? images : null}
  </div>);
}

// Render the state of a checkpoint
function CheckpointState ({ point }) {

  const state = point.state;
  if (state === "pending")
    return <span className="checkpointState"><i className="fa fa-spinner" /> 待审核</span>;
  else if (state === "accepted")
    return <span className="checkpointState" style={{ color: "green" }}><i className="fa fa-check" /> 已通过</span>;
  else if (state === "denied")
    return <span className="checkpointState" style={{ color: "red" }}><i className="fa fa-times" /> 未通过</span>;
  else
    return <span className="checkpointState"><i className="fa fa-bars" /> 未打卡</span>
}

// Render a full checkpoint, including header(name & state), images toggler,
// checkpoint details, current status on the checkpoint and photo uploader
// Props: point, onErr, fetchAlerts
class Checkpoint extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: false,
      photo: false,
      disabled: false,
      selectedFile: ""
    }
  }
  
  toggleImages() {
    this.setState({images: !this.state.images});
  }

  togglePhoto() {
    this.setState({photo: !this.state.photo});
  }

  handleInputChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({ selectedFile: e.target.files[0] })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ disabled: true });

    // Check the attached photo
    const photo = this.state.selectedFile;
    if (!photo) {
      this.props.onErr("请选择一张图片");
      this.setState({ disabled: false });
      return;
    }
    console.log(photo);
    var ext = photo.name.match(/\.([^\.]+)$/)[1];
    if (ext != "jpg" && ext != "jpeg") {
      this.props.onErr("无效的文件类型 " + ext);
      this.setState({ disabled: false });
      return;
    }
    if (photo.size > 10 * 1048576) {
      this.props.onErr("文件大小超过 10MB");
      this.setState({ disabled: false });
      return;
    }

    // Post to API
    const data = new FormData();
    data.append("photo", photo);
    data.append("checkpointid", this.props.point.id);
    let url = config.api_path + "/submit";
    axios.post(url, data)
      .then(res => {
        console.log(res);
        if (res.status == "200")
          this.props.fetchAlerts();
        this.setState({ disabled: false });
      })
      .catch(err => {
        this.props.onErr(handleApiError(err));
        this.setState({ disabled: false });
      });
  }

  render() {
    // Prepare the elements
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
    if (point.state === "accepted")
      myState = <p> <strong>我的得分</strong> {point.score} </p>;
    else if (point.state === "denied")
      myState = <p> <strong>我的不通过原因</strong> {point.fail_reason} </p>;

    return (<Accordion.Item eventKey={"P" + point.id}>
      <Accordion.Header><div style={{width: "100%", marginRight: "10px"}}>
        {point.id} {point.name} <CheckpointState point={point} />
      </div></Accordion.Header>
      <Accordion.Body>
        <p>
          <strong style={{marginRight: "1rem"}}>点位信息</strong>
          { point.images.length
            ? <Button variant="primary" id={"D" + point.id} onClick={() => { this.toggleImages() }}>
              {imagesButtonText}
            </Button>
            : null
          }
        </p>
        <CheckpointDetails point={point} show_images={this.state.images} />
        <p />
        <p> <strong>当前通过人数</strong> {point.passed ? point.passed : 0} </p>
        <p>
          <strong>我的打卡图片</strong> {photoAction}
          {this.state.photo ? <Image fluid src={config.upload_image_path + "/" + point.photo} /> : null}
        </p>
        { point.state != "accepted" &&
          <Form onChange={this.handleInputChange} onSubmit={this.handleSubmit}> <InputGroup>
            <Form.Control type="file" accept="image/*" />
            <Button disabled={this.state.disabled} variant="primary" id={"B" + point.id} type="submit">
              {point.state ? "重新上传" : "上传"}
            </Button>
          </InputGroup> </Form>
        }
        <p />
        {myTime}
        {myState}
      </Accordion.Body>
    </Accordion.Item>);
  }
}

// Render a group of checkpoints
function CheckpointGroup ({ group, onErr, fetchAlerts }) {
  const checkpoints = group.points.map((value, index) => {
    return <Checkpoint key={value.id} point={value} onErr={onErr} fetchAlerts={fetchAlerts} />;
  })
  return (<Accordion.Item eventKey={"G" + group.id}>
    <Accordion.Header>{group.id} {group.name}</Accordion.Header>
    <Accordion.Body>
      <p>{Parser(group.desc)}</p>
      <Accordion alwaysOpen>
        {checkpoints}
      </Accordion>
    </Accordion.Body>
  </Accordion.Item>);
}

// Render the checkpoint list consisting of groups
function CheckpointList ({ list, onErr, fetchAlerts }) {
  const checkpointGroups = list.map((value, index) => {
    return <CheckpointGroup key={value.id} group={value} onErr={onErr} fetchAlerts={fetchAlerts} />;
  })
  return <Accordion alwaysOpen> {checkpointGroups} </Accordion>;
}

// Render the alerts list
// The alerts is an array containing the direct output of the API
function AlertsList({ alerts, removeAlert }) {
  return (<>
    { alerts.map((value, index) => {
      return <Alert key={value} variant="primary" dismissible
        onClose={() => { removeAlert(value) }}>
          {value.time} {value.content}
        </Alert>
    }) }
  </>)
}

// The page component
// props: userId
export default class PageCheckpoints extends React.Component {
  audio = new Audio(process.env.PUBLIC_URL + "/sound.wav");
  siren = new Audio(process.env.PUBLIC_URL + "/siren.wav");

  constructor(props) {
    super(props);
    this.state = {
      err: {},
      alerts: [],
      list: []
    }
    axios.get(config.api_path + "/checkpoints")
      .then((res) => {
        this.setState({ list: res.data });
      })
      .catch((err) => {
        this.setState({ err: { ...this.state.err, apiErr: handleApiError(err) } });
      })
  }

  fetchAlerts = () => {
    axios.get(config.api_path + "/alerts")
      .then((res) => {
        // When the response is different than current alerts,
        // and the difference is not caused by deleting an alert,
        // play a sound and scroll to top
        if (JSON.stringify(this.state.alerts) !== JSON.stringify(res.data)
          && this.state.alerts.length < res.data.length) {
          this.audio.play();
          window.scrollTo(0, 0);
        }
        this.setState({ alerts: res.data });
      })
      .catch((err) => {
        this.setState({ err: { ...this.state.err, apiErr: handleApiError(err) } });
      });
  }

  setErr = (err) => {
    this.setState({ err: {...this.state.err, err: err} });
  }

  componentDidMount() {
    this.fetchAlerts();
    socket.on("update", (update) => {
      console.log("Receive update " + update);
      this.fetchAlerts();
      axios.get(config.api_path + "/checkpoints")
        .then((res) => {
          this.setState({ list: res.data });
        })
        .catch((err) => {
          this.setState({ err: { ...this.state.err, apiErr: handleApiError(err) } });
        })
    });

    socket.on("disconnect", (err) => {
      console.log("Socket disconnected");
      this.setState({ err: {
        ...this.state.err,
        socketErr: "与服务器的连接断开：" + err.toString() + "\n请刷新页面。"
      } });
      this.siren.play();
      window.scrollTo(0, 0);
    });
    socket.on("error", (err) => {
      console.log("Socket encountered an error");
      this.setState({ err: {
        ...this.state.err,
        socketErr: "与服务器的连接遇到问题：" + err.toString()
      } });
    })
  }

  componentWillUnmount() {
    socket.off("update");
    socket.off("disconnect");
    socket.off("error");
  }

  removeAlert(alert) {
    axios.post(config.api_path + "/alert/delete", alert)
      .then(() => {
        this.fetchAlerts();
      })
      .catch((err) => {
        this.setState({ err: { ...this.state.err, apiErr: handleApiError(err) } });
      });
  }

  renderErr() {
    let res = [];
    for (let i in this.state.err)
      if (this.state.err[i])
        res.push(<Alert variant="danger">{this.state.err[i].toString()}</Alert>);
    return res;
  }

  render() {
    return (<div className="m-3">
      {this.renderErr()}
      <AlertsList alerts={this.state.alerts} removeAlert={(x) => this.removeAlert(x)} />
      <CheckpointList list={this.state.list} onErr={this.setErr} fetchAlerts={this.fetchAlerts} />
    </div>)
  }
}