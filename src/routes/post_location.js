import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';

import '../public/upload.css';

//부트스트랩
import 'bootstrap/dist/css/bootstrap.min.css';


import 'firebase/auth';
import { db } from '../index.js';

const containerStyle = {
  width: '80%',
  height: '500px',
};

const mapOptions = {
  zoom: 18,
  disableDefaultUI: true,
};

function Post_location() {
  const [post_location, setPost_location] = useState(null);
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    return () => {
      db.collection('post')
        .doc(`${data}`)
        .get()
        .then((result) => {
          const locationData = result.data().location_data;
          setPost_location({ lat: locationData.lat, lng: locationData.lng });
          console.log(locationData.lat);
          console.log(locationData.lng);
        });
    };
  }, [data]);

  //누른 게시물의 문서id를 받아와 db에서 location_data를 불러오고, 그 정보를 토대로 지도 센터 조정,마커 찍기

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDhl39u_5WKV3Zlm32QG6ljnQlgzFzsC2g',
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GoogleMap mapContainerStyle={containerStyle} center={post_location} options={mapOptions}>
        {post_location && <Marker position={post_location} />}
      </GoogleMap>
    </>
  );
}

export default Post_location;
