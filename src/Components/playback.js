import React from "react";
import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
  } from "@react-google-maps/api";
  import bg from "../assests/sds.webp";
import Navbar from "./Navbar";

const PlaybackContainer = ({onClose }) => {

    const apiKey = "AIzaSyDciM17HrWOucxREypzzWE7KJ_wMqTVoZ0";

    const mapStyles = {
      height: "450px", width:'700px',
      border: "1px solid #000",
    };
  
    const defaultCenter = {
      lat: 13.009581,
      lng: 79.669749,
    };
  
    return (
        <>
      
         <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20"
      style={{ backgroundImage: `url(${bg})`,
      backgroundSize: "100% 100%",
      minHeight: "100vh",
      backgroundRepeat: "no-repeat",
      fontFamily: "serif",}}>
       
       <Navbar/>
        <div className="absolute bg-white p-4  w-5/6 h-5/6 z-20" style={{top:'80px', left:'100px'}}>
       {/* <div className='float-right' >
      <Link to="/dashboard">Close </Link>
            
       </div>
        */}
          <div className="bg-white p-4 rounded-lg  w-full h-full  text-center">
            {/* <h2 className="text-lg font-semibold mb-4">Playback Container</h2> */}
         
            <div className='flex'>
              <div className='flex-1'>
                {/* Add content of your first container */}
                <p>First Container Content</p>
              </div>
              <div className='flex-1'>
              <LoadScript
                  googleMapsApiKey={apiKey}
                  // onLoad={() => fetchDirectionData()}
                >
                  <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={9}
                    center={defaultCenter}
                    // onLoad={(map) => setMap(map)}
                  >
                   
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
     
    );
  };


  export default PlaybackContainer;