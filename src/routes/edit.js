//게시물 올리는 페이지
import '../public/upload.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

//부트스트랩
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

//firebase

import { storageRef } from '../index.js';
import { db } from '../index.js';

//컴포넌트
import MapComponent from '../components/map.js';

function Edit() {
  const post_data = useLocation();

  const post = post_data.state;
  console.log(post.location_data.lat);

  //업로드 할 항목들

  const [file, setFile] = useState(null); //사진파일

  let [text, setText] = useState(`${post.text}`); //글 내용

  const uploader = JSON.parse(sessionStorage.getItem('log-in-user')); //로그인 한 유저 정보

  const [location, setLocation] = useState(post.location_data);

  const handleLocationChange = (e) => {
    console.log(e);
    setLocation(JSON.parse(e));
  };
  //선택하지 않으면 이전 마커의 위치정보를 가져와 마커 찍기
  //선택하면 새로운 마커
  const [location_name, setLocation_name] = useState(post.location_name);
  const locationName_Change = (e) => {
    setLocation_name(e);
  };

  var date = new Date();
  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');

  //   var date_in_num = year + month + day + hours + minutes;

  //파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  //수정 기능
  const handleEdit = () => {
    const folderRef = storageRef.child(post.id + '/');
    folderRef
      .listAll()
      .then((result) => {
        if (file) {
          const filePromises = result.items.map((fileRef) => fileRef.delete());
          return Promise.all(filePromises);
        }
      })
      .then(() => {
        if (file) { //사진을 바꾸면
          const fileName = file.name;
          const uploadTask = storageRef.child(`${post.id}/` + fileName).put(file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // 업로드 진행 상태 처리
            },
            (error) => {
              console.log('업로드 실패');
              // 업로드 실패 처리
            },
            () => {
              // 업로드 성공 처리
              uploadTask.snapshot.ref
                .getDownloadURL()
                .then((downloadURL) => {
                  // 업로드된 이미지의 다운로드 URL 사용
                  console.log('다운로드 URL:', downloadURL);
                  var post_content = {
                    displayDate: `${year}년${month}월${day}일 ${hours}:${minutes}(수정됨)`,

                    text: text,
                    image: downloadURL,
                    uploader_uid: uploader.user.uid,
                    uploader_name: uploader.user.displayName,
                    location_data: location,
                    location_name: location_name,
                  };

                  db.collection('post')
                    .doc(`${post.id}`)
                    .update(post_content)
                    .then((result) => {
                      console.log(result);
                    });
                })
                .catch((error) => {
                  // 다운로드 URL 가져오기 실패 처리
                  console.log('업로드 실패');
                });
            }
          );
        } else { //바꾸지 않으면
          var post_content = {
            displayDate: `${year}년${month}월${day}일 ${hours}:${minutes}(수정됨)`,

            text: text,
            // image: downloadURL,
            uploader_uid: uploader.user.uid,
            uploader_name: uploader.user.displayName,
            location_data: location,
            location_name: location_name,
          };

          db.collection('post')
            .doc(`${post.id}`)
            .update(post_content)
            .then((result) => {
              console.log(result);
            });
        }
        console.log('폴더와 파일들이 성공적으로 삭제되었습니다.');
      })
      .catch((error) => {
        console.error('폴더와 파일들 삭제 중 오류가 발생했습니다.', error);
      });
  };

  return (
    <div id="hole_page">
      <input type="file" onChange={handleFileChange} />
      <img src={file} alt="" />
      <input type="text" name="" id="content" onChange={(e) => setText(e.target.value)} defaultValue={post.text} />

      <Button onClick={handleEdit}>Edit</Button>
      <br />
      <br />
      <div>
        <p>여행지 위치</p>

        <MapComponent handleLocationChange={handleLocationChange} locationName_Change={locationName_Change} location_data={post} />
        {location && (
          <div>
            lat:{location.lat} lng:{location.lng}
          </div>
        )}
        {location_name && <div>{location_name}</div>}
      </div>
    </div>
  );
}

export default Edit;
//사진 여러장 수정 기능