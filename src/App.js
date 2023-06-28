import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
//부트스트랩
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/esm/Container';
//firebase
import firebase from 'firebase/app';
import 'firebase/auth';

//컴포넌트
import Nav_bar from './components/nav_bar.js';
//라우팅
import Log_in from './routes/log_in.js';
import Main from './routes/main.js';
import Upload from './routes/upload.js';
import Post from './routes/posts.js';
import Post_location from './routes/post_location.js';
import Edit from './routes/edit.js';



function App() {

  

  let navigate = useNavigate();
  //로그인 유저 세션 관리
  const storedInfo = sessionStorage.getItem('log-in-user');
if (storedInfo) {
  const { userInfo, expirationTime } = JSON.parse(storedInfo);
  const currentTime = new Date().getTime();

  if (currentTime > expirationTime) {
    // 유효 기간이 지난 경우, 세션 스토리지에서 정보 제거
    sessionStorage.removeItem('userInfo');
  } else {
    // 유효 기간이 남은 경우, 정보 사용
    console.log(userInfo);
  }
}

  return (
    <>
      <Nav_bar></Nav_bar>
      
      <Container>
        <Routes>
          <Route path="/" element={<Main></Main>} />
          <Route path="/login" element={<Log_in></Log_in>} />
          <Route path="/upload" element={<Upload></Upload>} />
          <Route path="/post" element={<Post></Post>} />
          <Route path="/post_location" element={<Post_location></Post_location>} />
          <Route path="/edit" element={<Edit></Edit>} />
          <Route />
        </Routes>
      </Container>
    </>
  );
}

export default App;
