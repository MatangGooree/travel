import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker } from 'react-google-maps';
import firebase from 'firebase/app';
import 'firebase/auth';
import { db } from '../index.js';
import { storageRef } from '../index.js';
import MapComponent from '../components/map.js';

const provider = new firebase.auth.GoogleAuthProvider();

const load_data = async () => {
  const markers = [];
  const result = await db.collection('post').get();
  result.forEach(element => {
    markers.push(element.data().location_data);
  });
  return markers;
};

function Main() {
  // db에서 마커의 위치 정보들과 사진url을 가져와 object 형태로 저장
  // 형태는 [{ lat: 37.123, lng: -122.456, image: 'URL' }, ....]
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMarkers = await load_data();
      setMarkers(fetchedMarkers);
    };

    fetchData();
  }, []);


  
  return(
  <>
  <MapComponent location_data={markers} />
  </>)
}

export default Main;

//맵 컴포넌트를 지웠다가 다시 활성화 하면 정상 작동 함 ->marker전달보다 맵 로딩이 빨라서 생기는 문제라는 뜻
