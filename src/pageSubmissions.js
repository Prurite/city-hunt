import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Card, Image, Button, Form, InputGroup, Col, Row, FloatingLabel }
  from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import handleApiError from "./AxiosError";

const config = require("./config.json");
const socket = io({ path: config.api_path + "/socket.io" });

function SubmissionFilter(props) {
  const list = props.list;
  const states = {
    pending: "待审核",
    accepted: "已通过",
    denied: "未通过"
  };
  return (
    <Card className="p-3"> <Form onSubmit={props.handleSubmit}>
      <Form.Group as={Row} className="mb-1" controlId="formGroupAreas">
        <Form.Label column sm={2}>打卡区域</Form.Label>
        <Col style={{ alignSelf: "center" }}>
          {list.map((value, index) => {
            return <Form.Check defaultChecked inline type="checkbox"
              id={"G" + value.id} name={"G" + value.id} key={"G" + value.id}
              label={value.id + " " + value.name} />
          })}
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-1" controlId="formGroupStates">
        <Form.Label column sm={2}>状态</Form.Label>
        <Col style={{ alignSelf: "center" }}>
          <Form.Check defaultChecked inline type="checkbox"
            name={"pending"} id={"pending"} label={states["pending"]} />
          {["accepted", "denied"].map((value, index) => {
            return <Form.Check inline type="checkbox"
              name={value} id={value} key={value} label={states[value]} />
          })}
        </Col>
      </Form.Group>
      <Form.Group as={Row} style={{ marginBottom: "0" }} className="mb-3" controlId="formGroupIds">
        <Col>
          <FloatingLabel
            controlId="floatingGroupQuery"
            label="学号（例：12210101, 12210202）"
          >
            <Form.Control type="text" name="uids" placeholder="12210101" />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingPointQuery"
            label="打卡点号（例：1-1, 1-2）"
          >
            <Form.Control type="text" name="pointids" placeholder="1-1" />
          </FloatingLabel>
        </Col>
      </Form.Group>
      <Button type="submit">{props.buttext}</Button>
    </Form> </Card>
    )
}

function Submission({ sub, setErr }) {
  const [bonus, setBonus] = React.useState("");
  const [fail, setFail] = React.useState("");

  let state;
  if (sub.state === "accepted")
    state = "已通过";
  else if (sub.state === "denied")
    state = "已拒绝";
  else if (sub.state === "pending")
    state = "待审核";
  const score = sub.state == "accepted"
    && <p><strong>得分</strong> {sub.score}
    {sub.bonus ? `(+${sub.bonus})` : ""} </p>;
  const reason = sub.state == "denied"
    && <p><strong>拒绝原因</strong> {sub.fail_reason} </p>;

  function handleModify(state) {
    let data = { id: sub.id, state: state };
    if (state === "accepted")
      data.bonus = bonus;
    if (state === "denied")
      data.fail_reason = fail;
    axios.post(config.api_path + "/submission/modify", data)
      .then((res) => { console.log(res); })
      .catch((err) => { setErr(handleApiError(err)); })
  }

  return (<Card className="my-3">
    <Card.Header>{ "组 " + sub.uid+ " 点 " + sub.checkpointid}</Card.Header>
    <Image fluid src={config.upload_image_path + "/" + sub.photo} />
    <Card.Body>
      <p><strong>打卡时间</strong> {sub.uploaded_time}</p>
      <p><strong>状态</strong> {state}</p>
      {score}
      {reason}
      <Form onSubmit={e => e.preventDefault()}>
        <InputGroup className="mb-3">
          <Form.Control placeholder="附加分" id="bonus"
            value={bonus} onChange={e => setBonus(e.target.value)} />
          <Button variant="success" onClick={() => handleModify("accepted")}>通过</Button>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control placeholder="拒绝原因" id="fail_reason"
            value={fail} onChange={e => setFail(e.target.value)} />
          <Button variant="danger" onClick={() => handleModify("denied")}>拒绝</Button>
        </InputGroup>
      </Form>
    </Card.Body>
  </Card>)
}

export default function PageSubmissions() {
  const [list, setList] = React.useState([]);
  const [subs, setSubs] = React.useState([]);
  const [filter, setFilter] = React.useState({
    checkpointgroups: [],
    states: [],
    checkpoints: [],
    users: []
  });
  const [buttext, setButtext] = React.useState("开始接收提交");
  const [err, setErr] = React.useState(null);
  const [socketErr, setSocketErr] = React.useState(null);
  const audio = React.useMemo(() => new Audio(process.env.PUBLIC_URL + "/sound.wav"), []);
  const siren = React.useMemo(() => new Audio(process.env.PUBLIC_URL + "/siren.wav"), []);

  useEffect(() => {
    axios.get(config.api_path + "/checkpoints")
      .then((res) => { setList(res.data); })
      .catch((err) => { setErr(handleApiError(err)); });
  }, [])

  useEffect(() => {
    axios.post(config.api_path + "/submissions/query", filter)
      .then((res) => { setSubs(res.data); })
      .catch((err) => { setErr(handleApiError(err)); });
    socket.on("update", (update) => {
      console.log("Receive update " + update);
      setTimeout(() =>
        axios.post(config.api_path + "/submissions/query", filter)
          .then((res) => { setSubs(res.data); })
          .catch((err) => { setErr(handleApiError(err)); }),
        200);
    });
    socket.on("disconnect", (err) => {
      console.log("Socket disconnected");
      setSocketErr("与服务器的连接断开：" + err.toString() + "\n请刷新页面。");
      window.scrollTo(0, 0);
      siren.play();
    });
    socket.on("error", (err) => {
      console.log("Socket encountered an error");
      setSocketErr("与服务器的连接遇到问题：" + err.toString());
      siren.play();
    });
    return () => {
      socket.off("update");
      socket.off("disconnect");
      socket.off("error");
    };
  }, [filter]);

  useEffect(() => {
    audio.play();
  }, [subs]);

  function handleSubmit(e) {
    e.preventDefault();
    setButtext("过滤");
    let newFilter = {
      checkpointgroups: [],
      states: [],
    };
    for (let i of list)
      if (e.target["G" + i.id].checked)
        newFilter.checkpointgroups.push(i.id);
    for (let i of ["pending", "accepted", "denied"])
      if (e.target[i].checked)
        newFilter.states.push(i);
    if (e.target.uids.value)
      newFilter.uids = e.target.uids.value.replace(/\s+/g, "").split(",");
    if (e.target.pointids.value)
      newFilter.checkpoints = e.target.pointids.value.replace(/\s+/g, "").split(",");
    setFilter(newFilter);
  }

  return (<div className="m-3">
    {err && <Alert variant="danger">{err.toString()}</Alert>}
    {socketErr && <Alert variant="danger">{socketErr.toString()}</Alert>}
    <SubmissionFilter list={list} handleSubmit={handleSubmit} buttext={buttext}/>
    {subs.map((value, index) => {
      return <Submission id={value.id} key={value.id} sub={value} setErr={setErr} />;
    })}
  </div>);
}