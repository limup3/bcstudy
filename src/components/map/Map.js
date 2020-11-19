import React,{useState, useCallback,useRef, useEffect} from "react";
import { GoogleMap,useLoadScript,Marker} from "@react-google-maps/api";
import Geocode from 'react-geocode'
import './Map.css'

//구글맵 API 사용 , 현재는 명함 상세에 회사 위치정보만 표시 

const mapContainerStyle = {
    width: "100%",
   height : "300px"
}

const options = {
    zoomControl: true,
}

const MAP_KEY = 'AIzaSyASyU1D8PKZZQyhBrhb1dvqqx0i_0utoww';
//구글 맵 키

const libraries = ["places"];

  export default function Map(props) {

    const [lat, setLat] = useState(37.44)
    const [lng, setLng] = useState(126.88)

    Geocode.setApiKey(MAP_KEY);
    Geocode.setLanguage("kr");
    Geocode.setRegion("kr");
    useEffect(() =>{
        Geocode.fromAddress(props.bcAddr).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;
            setLat(lat)
            setLng(lng)
          },
          error => {
            console.error(error);
          }
        );
      },[props.bcAddr])
      //Geocode로 위도 경도를 주소값으로 변경
      //useEffect로 페이지 구동시 바로 실행되게 만듦


    
    const mapRef = useRef();
    //DOM 영역 직접 참조 

    const onMapLoad = useCallback((map)=>{
    mapRef.current = map;
    },[]);

    const { isLoaded,loadError } = useLoadScript({
        googleMapsApiKey: MAP_KEY,
        libraries,
        region:'kr'
    });

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";
  
    return (
      <>
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={{ lat: lat, lng: lng}}
        options={options}
        onLoad={onMapLoad}
      >
          <Marker
            position={{ lat: lat, lng: lng}}
          >

          </Marker>

      </GoogleMap>
      </>
      
    );
  }