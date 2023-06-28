import React from 'react';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../index.js';
import Container from 'react-bootstrap/esm/Container';

const provider = new firebase.auth.GoogleAuthProvider();

function Log_in() {
  // 구글 로그인 처리 함수
  const [loggedIn, setLoggedIn] = useState(false);

  function handleGoogleLogin() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // 로그인 성공 시 처리할 작업
        setLoggedIn(true);

        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('loggedIn');

            console.log(user)
            console.log(typeof(user))
            const loginTime = new Date().getTime();
            const expirationTime = loginTime + 60 * 60 * 1000; // 1시간 (밀리초 단위

            const login_user = {
              expirationTime,
              user
            };
            
            
            console.log(login_user);
            sessionStorage.setItem('log-in-user',JSON.stringify(login_user))

            // 사용자가 로그인한 상태

            //db의 user컬렉션에 유저 uid이름으로 문서를 만들고 디스플레이네임, 프로필사진 등 저장

            const user_data = {
              display_name: user.displayName,
              profile_image: user.photoURL,
            };

            db.collection('users')
              .doc(`${user.uid}`)
              .update(user_data)
              .then((result) => {
                console.log(result);
              });
          } else {
            console.log('loggedout');
            // 사용자가 로그아웃한 상태
          }
        });

        console.log('로그인 사용자:', result.user.displayName);
      })
      .catch((error) => {
        // 로그인 실패 시 처리할 작업
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('로그인 에러:', errorCode, errorMessage);
      });
  }

  return (
    <Container>
      <br />
      <Button variant="primary" onClick={handleGoogleLogin}>
        구글로 로그인
      </Button>
    </Container>
  );
}

export default Log_in;
