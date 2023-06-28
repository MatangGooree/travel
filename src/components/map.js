import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '80%',
  height: '500px',
};

const mapOptions = {
  zoom: 18,
  disableDefaultUI: true,
};
//컴포넌트 시작
function MapComponent({ handleLocationChange, locationName_Change, location_data }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDhl39u_5WKV3Zlm32QG6ljnQlgzFzsC2g',
  });

  // 클릭 이벤트
  const handleMapClick = async (event) => {
    const clickedLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    // 위치 데이터 및 위치 이름 업데이트
    const updatedLocationData = JSON.stringify(clickedLocation);
    const updatedLocationName = await getLocationName(clickedLocation);

    console.log(clickedLocation);
    setMarkerLocation(clickedLocation);

    handleLocationChange(updatedLocationData);
    locationName_Change(updatedLocationName);
  };
  //수정 전 위치 이름 가져오기

  // 위치 이름 가져오기
  const getLocationName = async (location) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyDhl39u_5WKV3Zlm32QG6ljnQlgzFzsC2g`);
      const data = await response.json();
      const locationResult = data.results[0];
      const formattedAddress = locationResult.formatted_address;
      return formattedAddress;
    } catch (error) {
      console.log('Error getting location details:', error);
      return null;
    }
  };

  const getOriginalName = async (e) => {
    const updatedLocationData = JSON.stringify(e);
    const updatedLocationName = await getLocationName(e);

    handleLocationChange(updatedLocationData);
    locationName_Change(updatedLocationName);
  };


  
  useEffect(() => {
    console.log(location_data);

    if (location_data) {
      //받아온 지역 정보가 있고, 그것이 array라면
      if (location_data instanceof Array == true) {
        console.log(location_data);
        setCurrentLocation({ lat: location_data[0].lat, lng: location_data[0].lng });
        setMarkerLocation(location_data);
      } else {
        setCurrentLocation(location_data.location_data);
        setMarkerLocation(location_data.location_data);
      }
    } else if (navigator.geolocation) {
      //현재 위치를 어떤 경우에라도 사용할 수 있도록 최상단에 state로 저장
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const now_location = { lat: latitude, lng: longitude };

          setCurrentLocation(now_location);
          setMarkerLocation(now_location);
          getOriginalName(now_location);
        },
        (error) => {
          console.log('Error getting current location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <GoogleMap mapContainerStyle={containerStyle} center={currentLocation} options={mapOptions} onClick={handleMapClick}>
        //하나의 좌표라면
        {!Array.isArray(markerLocation) && <Marker position={markerLocation} />}
        //둘 이상의 좌표라면
        {Array.isArray(markerLocation) && markerLocation.map((marker, index) => <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />)}
      </GoogleMap>
    </div>
  );
}
export default MapComponent;

//마커를 찍은곳의 위치를 REDUX등을 통해 다른곳에서도 활용할 수 있도록(DB저장만 하면 언제든 꺼내볼 수 있으니 업로드에서 사용 가능하면 됨)

//만약 마커의 위치가 여러개라면 if 연산자의 왼편에 array라면, 오른편에는 그대로 markerLocation

//지도 컴포넌트는 자주 사용하므로 restfull하게 수정해야 할 듯
