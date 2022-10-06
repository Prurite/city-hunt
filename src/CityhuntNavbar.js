import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar } from 'react-bootstrap';

export function MyNavbar(props) {
  return (<Navbar bg="light" expand="lg" className="mb-3"> <Container>
    <Navbar.Brand>Cityhunt</Navbar.Brand>
  </Container> </Navbar>)
}