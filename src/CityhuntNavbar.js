import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useAuth } from './AuthProvider';

export default function MyNavbar() {
  const uid = useAuth().uid;
  const onLogout = useAuth().onLogout;
  return (<Navbar bg="light" expand="lg" className="mb-3"> <Container>
    <Navbar.Brand>Cityhunt</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-nav" />
    <Navbar.Collapse id="navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/submissions">提交</Nav.Link>
        <Nav.Link href="/checkpoints">打卡点</Nav.Link>
      </Nav>
      <Nav className="justify-content-end">
        <NavDropdown title={uid ? uid : "游客"} id="nav-dropdown" >
          {!uid && <NavDropdown.Item href="/login">登录</NavDropdown.Item>}
          {uid && <NavDropdown.Item href="/changepassword">修改密码</NavDropdown.Item>}
          {uid && <NavDropdown.Item onClick={onLogout}>退出</NavDropdown.Item>}
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Container> </Navbar>)
}