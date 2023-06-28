import '../routes/posts.css';
//페이스북, 인스타처럼 피드를 나열하는 컴포넌트
import {useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

//부트스트랩
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import { Image } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
//firebase

import 'firebase/auth';
import { db } from '../index.js';
import { storageRef } from '../index.js';
//DB에서 게시물 정보를 하나하나 불러와 최신순으로 정리
/*
게시물의 id와 업로드 시간을 저장해 시간순서대로 나열, 
각각의 게시물에서 해당 id를 토대로 게시물 정보 db에서 가져오기

locationName을 누르면 해당 위치 지도로 표기 - 게시물 정보를 params로 받아서 각각 다르게 할지, 그냥 일회성으로 보여주는 페이지 이므로 상관없을지

uploader_uid를 토대로 users 컬렉션에서 유저 디스플레이 이름과 프로필사진을 가져와 postList에 push

*/
function Posts() {
  const [postList, setPostList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Firestore 데이터 변경 시 실시간 업데이트 수신
    const unsubscribe = db
      .collection('post')
      .orderBy('date', 'desc')
      .onSnapshot((snapshot) => {
        const promises = [];

        snapshot.forEach((doc) => {
          const documentId = doc.id;
          const postData = { id: documentId, ...doc.data() };

          const promise = db
            .collection('users')
            .doc(`${doc.data().uploader_uid}`)
            .get()
            .then((result) => {
              const add_data = { display_name: result.data().display_name, profile_URL: result.data().profile_image, ...postData };
              return add_data;
            })
            .catch((error) => {
              console.error(error);
              return null;
            });

          promises.push(promise);
        });

        Promise.all(promises)
          .then((results) => {
            const validResults = results.filter((result) => result !== null);
            setPostList(validResults);
          })
          .catch((error) => {
            console.error(error);
          });
      });

    // 컴포넌트 언마운트 시 실시간 업데이트 수신 중지
    return () => unsubscribe();
  }, []);
  const now_user = JSON.parse(sessionStorage.getItem('log-in-user'));
console.log(now_user.user.uid)
  function delete_post(e) {
    db.collection('post')
      .doc(e)
      .delete()
      .then(() => {
        console.log('삭제 성공');
      })
      .catch(() => {
        console.log('삭제 실패');
      });

    const folderRef = storageRef.child(e + '/');
    folderRef
      .listAll()
      .then((result) => {
        const filePromises = result.items.map((fileRef) => fileRef.delete());
        return Promise.all(filePromises);
      })
      .then(() => {
        console.log('폴더와 파일들이 성공적으로 삭제되었습니다.');
      })
      .catch((error) => {
        console.error('폴더와 파일들 삭제 중 오류가 발생했습니다.', error);
      });
  }

  return (
    <>
      <ol id="card_list">
        {postList.map((post) => (
          <li key={post.id} id="cards">
            {/* location_name을 누르면 지도에 위치를 찍어 보여주기 */}
            <Card style={{ width: '50rem' }}>
              <Card.Body>
                <div id="card_top">
                  <div id="card_top_left">
                    {' '}
                    <Image src={post.profile_URL} alt="Profile Image" roundedCircle style={{ width: '3rem', height: '3rem', marginRight: '1rem' }} />
                    <Card.Title>{post.display_name}</Card.Title>
                  </div>
                  <NavDropdown id="card_top_right" title=":::" menuVariant="light">
                    <NavDropdown.Item>신고</NavDropdown.Item>

                    {now_user.user.uid == post.uploader_uid && <NavDropdown.Item onClick={()=>{navigate('/edit',{state:post});}}>수정</NavDropdown.Item>}
                    {now_user.user.uid == post.uploader_uid && (
                      <NavDropdown.Item
                        onClick={() => {
                          delete_post(post.id);
                        }}>
                        삭제
                      </NavDropdown.Item>
                    )}
                  </NavDropdown>
                </div>
                <br />
                <Card.Text
                  onClick={() => {
                    navigate('/post_location', { state: post.id });
                  }}>
                  {post.location_name}
                </Card.Text>
               < Card.Text>
              { post.displayDate}
                </Card.Text>
                <Card.Img id="card_img" variant="top" src={post.image} style={{ height: '30rem' }} />
                <Button variant="primary">좋아요 버튼</Button>
                <Button variant="primary">댓글 더보기 버튼</Button>
                <Card.Text>{post.text}</Card.Text>
              </Card.Body>
            </Card>
          </li>
        ))}
      </ol>
    </>
  );
}

export default Posts;

//