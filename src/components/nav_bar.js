import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Nav_bar() {
  const [log_in, setLog_in] = useState(false);
  
  const isLogin = sessionStorage.getItem('log-in-user');

  let navigate = useNavigate();

  function Log_out() {
    sessionStorage.removeItem('log-in-user');
    firebase.auth().signOut();
    
    setLog_in(false)
    navigate('/login')
  }

  useEffect(() => {

    if (sessionStorage.getItem('log-in-user')) {
      setLog_in(true);
    } 
    console.log(log_in);
  },[]);

  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand
            onClick={() => {
              navigate('/');
            }}>
            Navbar
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => {
                navigate('/');
              }}>
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => {

                if(isLogin !==null){
                  navigate('/post');

                }else{
                  alert('로그인하세요')
                  navigate('/login')
                }

              }}>
              Post
            </Nav.Link>

            <Nav.Link
              onClick={() => {
                if(isLogin !==null){
                navigate('/upload');

              }else{
                alert('로그인하세요')
                navigate('/login')
              }
              }}>
              Upload
            </Nav.Link>

            {/* 드롭다운 메뉴 */}

            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />

              {log_in ? (
                <NavDropdown.Item onClick={Log_out}>로그아웃</NavDropdown.Item>
              ) : (
                <NavDropdown.Item onClick={() => navigate('/login')}>로그인</NavDropdown.Item>
              )}

            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default Nav_bar;


//로그인 하면 로그아웃 버튼으로 변하도록 + 로그아웃 하면 로그인 페이지로만 이동 가능(권한문제)
