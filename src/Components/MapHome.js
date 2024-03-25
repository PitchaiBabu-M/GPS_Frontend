import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import { FaCopy, FaMapPin, FaMapMarker } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaRoute } from "react-icons/fa6";
import { RiMapPinLine } from "react-icons/ri";
import { BsPersonStanding } from "react-icons/bs";
import { MdSpeed } from "react-icons/md";
import gT from "../assests/gt.png";
import yT from "../assests/yt.png";
import rT from "../assests/rt.png";
import config from "../config";
import Navbar from "./Navbar";
import VehicleDataTable from './Listview';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx";
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer from react-toastify
import 'react-toastify/dist/ReactToastify.css';


function MapHome() {
  const [directionData, setDirectionData] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [sortByOpen, setSortByOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [showMapPinnedVehicles, setShowMapPinnedVehicles] = useState(true); 
  const [filtereddata,setFiltereddata] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

 const [selectedCheckbox, setSelectedCheckbox] = useState('all');
 const [allcount,setAllcount] = useState();
 const [movingcount,setMovingcount] = useState();
 const [idlecount,setIdlecount] = useState();
 const [offlinecount,setOfflinecount] = useState();
 const [sortBy, setSortBy] = useState('');
 const [lastSelectedCheckbox, setLastSelectedCheckbox] = useState('all');
 const [selectedVehicleData, setSelectedVehicleData] = useState([]);
 const [showVehicleDataTable, setShowVehicleDataTable] = useState(false);
 const [mapdata,setMapData] = useState([]);
 const [mapcenter,setMapcenter] = useState({
  lat: 13.137165,
  lng: 80.238096,
});
const[zoomlevel,setZoomLevel] = useState(12);

// search functionalitty
const [searchTerm, setSearchTerm] = useState('');
const handleSearchChange = (e) => {
  const searchTerm = e.target.value.trim(); // Get the search term without leading or trailing spaces
  setSearchTerm(searchTerm);

  if (searchTerm === '') {
    setSelectedVehicleData([]);
    fetchDirectionData(); // Restore full data when search term is empty
  } else {
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, ''); // Normalize the search term for comparison
    const filteredSearchData = directionData.filter((vehicle) =>
      vehicle.shortName.toLowerCase().replace(/\s/g, '').includes(normalizedSearchTerm)
    );

    if (filteredSearchData.length === 0) {
      // Handle the case where no matching data is found
      setDirectionData([])
      setSelectedVehicleData([]); // Set selected data to empty array or perform any other appropriate action
      setMapData([]); // Set map data to empty array or perform any other appropriate action
    } else {
      setSelectedVehicleData(filteredSearchData);
      setMapData(filteredSearchData);
    }
  }
};




//checkboxchange 
const [selectedVehicles, setSelectedVehicles] = useState([]);
const [checkedVehicles, setCheckedVehicles] = useState([]);
const handleCheckboxChange = (index) => {
  const updatedChecked = checkedVehicles.map((value, i) => (i === index ? !value : value));
  setCheckedVehicles(updatedChecked);

  // Update mapdata based on checkbox changes
  const updatedMapData = directionData.filter((_, i) => updatedChecked[i]);
  if (selectedVehicleData.length > 0 ){
    console.log('selectedvehicle',selectedVehicleData);
    const updatedselectedMapData = selectedVehicleData.filter((_, i) => updatedChecked[i]);
    setMapData(updatedselectedMapData)
  }else{
    setMapData(updatedMapData);
  }
  
};

 const handleButtonClick = () => {
  setShowVehicleDataTable(!showVehicleDataTable);
};

//copy function
const successToastContainerStyle = {
  background: 'rgb(75, 212, 71)',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  padding: '12px',
  fontSize: '14px',
};

const failureToastContainerStyle = {
  background: 'red',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  padding: '12px',
  fontSize: '14px',
};

const showSuccessToast = (message) => {
  toast.success(`${message}`, {
    position: 'top-right',
    autoClose: 2000,
    toastClassName: 'success-toast',
    bodyClassName: 'success-toast-body',
    style: successToastContainerStyle,
  });
};

const showFailureToast = (message) => {
  toast.error(`${message}`, {
    position: 'top-right',
    autoClose: 2000,
    toastClassName: 'failure-toast',
    bodyClassName: 'failure-toast-body',
    style: failureToastContainerStyle,
  });
};

const handleCopyAddress = (address) => {
  console.log('copy');
  navigator.clipboard.writeText(address);
  showSuccessToast('Address copied successfully!');
};

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/vehicledata/suggestions`
      ); 
      setSuggestions(response.data.map((item) => item.shortName));
      console.log(response.data, "data");
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchDirectionData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/vehicledata/alldatas`);
      setFiltereddata(response.data);
      setAllcount((response.data).length);
      setMovingcount(((response.data).filter(
        (item) => item.ignitionStatus === 'ON' && item.speed > 0 && item.noDataTime === '00:00:00'
      )).length)
      setIdlecount(((response.data).filter(
        (item) =>
          (item.ignitionStatus === 'OFF' || item.ignitionStatus === 'ON') &&
          item.speed === 0 &&
          item.noDataTime === '00:00:00'
      )).length)
      setOfflinecount(((response.data).filter(
        (item) => item.ignitionStatus === 'OFF' && item.speed === 0 && item.noDataTime !== '00:00:00'
      )).length)
      // if (selectedCheckbox === 'all') {
      //   setDirectionData(response.data)
        
      // }
      console.log(lastSelectedCheckbox);
  
      switch (lastSelectedCheckbox) {
        case 'all':
          setDirectionData(response.data);
          setMapData(response.data)
          break;
        case 'moving':
          setDirectionData(response.data.filter(
            item => item.ignitionStatus === 'ON' && item.speed > 0 && item.noDataTime === '00:00:00'
          ));
          setMapData(response.data.filter(
            item => item.ignitionStatus === 'ON' && item.speed > 0 && item.noDataTime === '00:00:00'
          ))
          console.log('directiondata',directionData);
          
          break;
        case 'idle':
          setDirectionData(response.data.filter(
            item => (item.ignitionStatus === 'OFF' || item.ignitionStatus === 'ON') &&
                    item.speed === 0 &&
                    item.noDataTime === '00:00:00'
          ));
          setMapData(response.data.filter(
            item => (item.ignitionStatus === 'OFF' || item.ignitionStatus === 'ON') &&
                    item.speed === 0 &&
                    item.noDataTime === '00:00:00'
          ))
          console.log('directiondata',directionData);
          break;
        case 'offline':
          setDirectionData(response.data.filter(
            item => item.ignitionStatus === 'OFF' && item.speed === 0 && item.noDataTime !== '00:00:00'
          ));
          setMapData(response.data.filter(
            item => item.ignitionStatus === 'OFF' && item.speed === 0 && item.noDataTime !== '00:00:00'
          ))
          
          console.log('directiondata',directionData);
          break;
        default:
          setDirectionData(response.data);
          setMapData(response.data);
          break;
      }
      if (response.data.length > 0) {
        setCheckedVehicles(response.data.map(() => true));
      }

      
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchDirectionData();
    
  // Set up automatic refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDirectionData();
      
      console.log('hello');
    }, 100000);
    
   
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [selectedCheckbox]);

  function getVehicleColorClass(vehicle) {
    if (
      vehicle.speed > 0 &&
      vehicle.ignitionStatus === "ON" &&
      vehicle.noDataTime === "00:00:00"
    ) {
      return "text-green-500"; 
    } else if (
      vehicle.speed === 0 &&
      (vehicle.ignitionStatus === "ON" || vehicle.ignitionStatus === "OFF") &&
      vehicle.noDataTime === "00:00:00"
    ) {
      return "text-amber-500"; 
    } else {
      return "text-red-500"; 
    }
  }
  const handleSuggestionChange = (selectedSuggestion) => {
    // Filter the direction data based on the selected vehicle
    const selectedVehicleData = directionData.filter((vehicle) => vehicle.shortName === selectedSuggestion);
  
    // Update the state to reflect the filtered data
    setSelectedVehicleData(selectedVehicleData);
  
    // Log the updated selectedVehicleData
    console.log('Selected Vehicle Data:', selectedVehicleData);
  };
  const filteredDirectionData =mapdata;
  const checboxFilter = (type) => {
    setSelectedCheckbox(type !== selectedCheckbox ? type : selectedCheckbox);
    setLastSelectedCheckbox(type);
    setSelectedVehicleData([]);
    setSearchTerm('');
    let filteredShortNames = [];
  
  
    switch (type) {
        case 'moving':
        const movingDirectionData = filtereddata.filter(
          (item) => item.ignitionStatus === 'ON' && item.speed > 0 && item.noDataTime === '00:00:00'
        );
        setDirectionData(movingDirectionData);
        setMapData(movingDirectionData)
        filteredShortNames = movingDirectionData.map((vehicle) => vehicle.shortName);
        break;
      case 'idle':
        const idleDirectionData = filtereddata.filter(
          (item) => (item.ignitionStatus === 'OFF' || item.ignitionStatus === 'ON') && item.speed === 0 && item.noDataTime === '00:00:00'
        );
        setDirectionData(idleDirectionData);
        setMapData(idleDirectionData)
        filteredShortNames = idleDirectionData.map((vehicle) => vehicle.shortName);
        break;
      case 'offline':
        const offlineDirectionData = filtereddata.filter(
          (item) => item.ignitionStatus === 'OFF' && item.speed === 0 && item.noDataTime !== '00:00:00'
        );
        setDirectionData(offlineDirectionData);
        setMapData(offlineDirectionData)
        filteredShortNames = offlineDirectionData.map((vehicle) => vehicle.shortName);
        break;
      default:
        setDirectionData(filtereddata);
        setMapData(filtereddata)
        filteredShortNames = filtereddata.map((vehicle) => vehicle.shortName);
        fetchSuggestions(); // Call fetchSuggestions when 'all' checkbox is selected
        break;
    }
  
  
    // Here you can use filteredShortNames according to your requirements
    setSuggestions(filteredShortNames);
  
  
    // Optionally, you can set a state with filteredShortNames if needed
  };

  const mapStyles = {
    height: "500px",
    border: "1px solid #000",
  };

  const defaultCenter = {
    lat: 13.184846,
    lng: 80.089766,
  };

  const apiKey = "AIzaSyDciM17HrWOucxREypzzWE7KJ_wMqTVoZ0";

  const toggleSortByDropdown = () => {
    setSortByOpen(!sortByOpen);
  };







  const toggleDownloadDropdown = () => {
    setDownloadOpen(!downloadOpen);
  };
  const handleFilter1CheckboxChange = () => {
    setShowMapPinnedVehicles(!showMapPinnedVehicles);
  };
  function formatVehicleNumber(shortName) {
    return shortName.replace(
      /^([A-Z]{2})(\d{2})([A-Z]{1,2})(\d{1,4})$/,
      "$1 $2 $3 $4"
    );
  }
  const handleSortBy = (option) => {
    setSortBy(option);
    setSortByOpen(false);

    if (option === "A-Z") {
      setDirectionData([
        ...directionData.sort((a, b) => a.shortName.localeCompare(b.shortName)),
      ]);
      setMapData([
        ...directionData.sort((a, b) => a.shortName.localeCompare(b.shortName)),
      ]);
    } else if (option === "Z-A") {
      setDirectionData([
        ...directionData.sort((a, b) => b.shortName.localeCompare(a.shortName)),
      ]);
      setMapData([
        ...directionData.sort((a, b) => b.shortName.localeCompare(a.shortName)),
      ]);
    }
  };
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const formatDirectionData = () => {
    return directionData.map(vehicle => ({
      Vehicle: vehicle.shortName,
      Location: vehicle.address,
      Time: vehicle.Time,
      Speed: `${vehicle.speed} kmph`,
      "Last Seen": vehicle.lastSeen,
      Ignition: vehicle.ignitionStatus,
      Battery: "high" // Assuming this is a constant value for all vehicles
    }));
  };







  const handleDownloadPDF = () => {

    const generatePDF = () => {

      const pdf = new jsPDF('p', 'mm', 'a4');

      const table = document.createElement('table');

      const tbody = document.createElement('tbody');

 

      // Add table headers

      const headers = ['Vehicle', 'Location', 'Time', 'Speed(kmph)', 'Last Seen', 'Ignition','Battery'];

      const headerRow = document.createElement('tr');

      headers.forEach(headerText => {

        const th = document.createElement('th');

        th.appendChild(document.createTextNode(headerText));

        headerRow.appendChild(th);

      });

      tbody.appendChild(headerRow);

 

      // Add table data

      directionData.forEach(vehicle => {

        const row = document.createElement('tr');

        row.innerHTML = `

          <td>${vehicle.shortName}</td>

          <td>${vehicle.address}</td>

          <td>${vehicle.Time}</td>

          <td>${vehicle.speed}</td>

          <td>${vehicle.lastSeen}</td>

          <td>${vehicle.ignitionStatus}</td>

          <td>high</td>

        `;

        tbody.appendChild(row);

      });

 

      table.appendChild(tbody);

      const columnStyles = {

        0: { cellWidth: 40 }, // Adjust width of the first column (Vehicle)

        1: { cellWidth: 40 },

        2:  { cellWidth: 20 },

        3:  { cellWidth: 20 },

        4:  { cellWidth: 20 },

        5:  { cellWidth: 20 },

        6:  { cellWidth: 20 },

     

      };

 

      pdf.autoTable({

        html: table,

        theme: 'grid', // Set theme to 'grid' for borders

        styles: {

          headStyles: { fillColor: [100, 100, 255] }, // Header fill color (RGB)

          styles: { fillColor: [255, 255, 255] },

          columnStyles: columnStyles, // Body fill color (RGB)

        }

       } );

 

      pdf.save('direction_data.pdf');

    };

 

    generatePDF();

  };

  const exportToExcel = () => {
    const formattedData = formatDirectionData();

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Direction Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "direction_data.xlsx");
  };

  return (
    <div className="md:h-screen md:overflow-hidden">
      <Navbar />
      <ToastContainer position="top-right" />
      <div className="md:container-fluid mx-auto mt-16  md:mt-16">
        <div className="md:fixed md:top-16 top-10 left-0 right-0 md:left-4 md:right-4 grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
          <div className="flex flex-col md:flex-row items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="searchCheckbox"
                className="text-white mr-2"
                onChange={handleFilter1CheckboxChange}
                checked={showMapPinnedVehicles}
              />
                      <div className="relative">
                      <input
        type="text"
        placeholder="Search by Vehicle No."
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        value={searchTerm}
        onChange={handleSearchChange}
      />
  <datalist id="suggestionsList">
    {suggestions.map((suggestion, index) => (
      <option key={index} value={suggestion} />
    ))}
  </datalist>
  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
    <CiSearch />
  </div>
</div>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <input
                type="checkbox"
                id="all"
                onChange={() => checboxFilter("all")}
                checked={selectedCheckbox === "all"}
              />
              <label htmlFor="all" className="text-blue-500 text-base">
                {allcount} All
              </label>
              <input
                type="checkbox"
                id="moving"
                onChange={() => checboxFilter("moving")}
                checked={selectedCheckbox === "moving"}
              />
              <label htmlFor="moving" className="text-green-500 text-base">
                {movingcount} Moving
              </label>
              <input
                type="checkbox"
                id="idle"
                onChange={() => checboxFilter("idle")}
                checked={selectedCheckbox === "idle"}
              />
              <label htmlFor="idle" className="text-amber-500 text-base">
                {idlecount} Idle
              </label>
              <input
                type="checkbox"
                id="offline"
                onChange={() => checboxFilter("offline")}
                checked={selectedCheckbox === "offline"}
              />
              <label htmlFor="offline" className="text-red-500 text-base">
                {" "}
                {offlinecount} Offline
              </label>
            </div>
          </div>
          <div className="flex items-center mr-2 space-x-2 mt-0 md:mt-0">
            <div className="relative w-1/2 flex justify-end">
              {" "}
              <select
                className="px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none text-sm"
                onChange={(e) => {
                  if (e.target.value === "asc") {
                    handleSortBy("A-Z");
                  } else if (e.target.value === "desc") {
                    handleSortBy("Z-A");
                  } else {
                    toggleSortByDropdown();
                  }
                }}
                defaultValue="" 
              >
                <option value="" disabled>
                  Sort By
                </option>
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>
 <div className="relative flex flex-nowrap space-x-2 w-1/2">
        <button
          className="px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none text-sm whitespace-nowrap"
          onClick={handleButtonClick}
        >
          List View & Map View
        </button>
        {/* Other elements */}
      </div>

      <div className="relative">
            <select

className="px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none text-sm"

onChange={handleDropdownChange}

value={selectedOption}

>

<option value="" disabled>

  Download

</option>

<option value="pdf" onClick={handleDownloadPDF}>PDF</option>

<option value="excel" onClick={exportToExcel}>Excel</option>

</select>
            </div>
          </div>
        </div>

        {showVehicleDataTable ? (
        <div className=" m-5 md:mt-32 xs:mt-10  md:max-h-[480px] overflow-y-auto">
               <VehicleDataTable Direction ={directionData} />
        </div>
      ) : (
        <div className="md:container-fluid md:mt-10 xs:mt-10 bg-gray-100">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-5/12 mb-4  mt-0 md:mb-0 md:mt-16  max-h-[310px] md:max-h-[500px] overflow-y-auto bg-gray-100">
            <div className="border border-gray-400 rounded-lg">
                {selectedVehicleData && selectedVehicleData.length > 0 ? (
  // Render content for the selected vehicle
  selectedVehicleData.map((vehicle, index) => (
    <div key={index} className="border-b-2 border-gray-300 py-4">
    <div className="flex items-center ml-2"> {/* Container for checkbox and label */}
    <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600"
              checked={checkedVehicles[index]}
              onChange={() => handleCheckboxChange(index)}
            />

      <div>
        <label className="flex items-center space-x-4 px-4">
          <span className={`text-sm font-medium ${getVehicleColorClass(vehicle)}`}>
            {formatVehicleNumber(vehicle.shortName)}
          </span>
          <FaCopy
  className={`w-3 h-4 text-blue-500 cursor-pointer`}
  onClick={() => handleCopyAddress(vehicle.address)}
/>
          <FaMapPin className="w-3 h-4 text-green-500"   />
        </label>
      </div>
    </div>
    
    <div className="mt-4 px-4">
      <div className="flex items-center space-x-4">
        {/* Right side content */}
        <div className="flex flex-col w-1/2 justify-end space-y-2">
          <div className="flex items-center">
            <FaRoute />
            <span className="text-xs ml-2 font-medium">Route</span>
          </div>
          <span className="text-xs">IGNITION: {vehicle.ignitionstatus}</span>
          <span className="text-xs">BATTERY: HIGH</span>
        </div>
  
        {/* Left side content */}
        <div className="flex flex-col w-2/3">
          {/* Address */}
          <div className="flex items-start mb-1">
            <RiMapPinLine className="mr-1 h-5 w-4 mt-0 text-blue-700" />
            <span className="text-xs break-words">{vehicle.address}</span>
          </div>
  
          {/* Time */}
          <span className="text-xs ml-5">{vehicle.time}</span>
  
          {/* No Stand Nearby */}
          <span className="text-xs flex items-center">
            <BsPersonStanding className="h-6 w-5 ml-0" />
            No Stand Nearby
          </span>
  
          {/* Vehicle Speed */}
          <span className="text-xs flex items-center">
            <MdSpeed className="h-5 w-4 mr-1 text-red-600" />
            {vehicle.speed} kmph
          </span>
        </div>
      </div>
    </div>
  </div>
  ))
) : (
  // Render content for all vehicles
  directionData.map((vehicle, index) => (
    <div key={index} className="border-b-2 border-gray-300 py-4">
 <div className="flex items-center ml-2">
 <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600"
              checked={checkedVehicles[index]}
              onChange={() => handleCheckboxChange(index)}
            />

      <div>
        <label className="flex items-center space-x-4 px-4">
          <span className={`text-sm font-medium ${getVehicleColorClass(vehicle)}`}>
            {formatVehicleNumber(vehicle.shortName)}
          </span>
          <FaCopy
  className={`w-3 h-4 text-blue-500 cursor-pointer`}
  onClick={() => handleCopyAddress(vehicle.address)}
/>
          <FaMapPin className="w-3 h-4 text-green-500" />
        </label>
      </div>
    </div>
    
    <div className="mt-4 px-4">
      <div className="flex items-center space-x-4">
        {/* Right side content */}
        <div className="flex flex-col w-1/2 justify-end space-y-2">
          <div className="flex items-center">
            <FaRoute />
            <span className="text-xs ml-2 font-medium">Route</span>
          </div>
          <span className="text-xs">IGNITION: {vehicle.ignitionstatus}</span>
          <span className="text-xs">BATTERY: HIGH</span>
        </div>
  
        {/* Left side content */}
        <div className="flex flex-col w-2/3">
          {/* Address */}
          <div className="flex items-start mb-1">
            <RiMapPinLine className="mr-1 h-5 w-4 mt-0 text-blue-700" />
            <span className="text-xs break-words">{vehicle.address}</span>
          </div>
  
          {/* Time */}
          <span className="text-xs ml-5">{vehicle.time}</span>
  
          {/* No Stand Nearby */}
          <span className="text-xs flex items-center">
            <BsPersonStanding className="h-6 w-5 ml-0" />
            No Stand Nearby
          </span>
  
          {/* Vehicle Speed */}
          <span className="text-xs flex items-center">
            <MdSpeed className="h-5 w-4 mr-1 text-red-600" />
            {vehicle.speed} kmph
          </span>
        </div>
      </div>
    </div>
  </div>
  ))
)}
                </div>
            </div>

            <div className=" w-full md:w-7/12 md:m-16 md:ml-0 mr-auto md:mr-0 md:flex-row md:overflow-x-auto rounded-lg shadow-md">
              <LoadScript
                googleMapsApiKey={apiKey}
                onLoad={() => fetchDirectionData()}
              >
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={zoomlevel}
                  center={mapcenter}
                  onLoad={(map) => setMap(map)}
                >
                  {map &&
                     filteredDirectionData.map((direction, index) => {
                      const latitude = parseFloat(direction.latitude);
                      const longitude = parseFloat(direction.longitude);

                      if (!isNaN(latitude) && !isNaN(longitude)) {
                        let iconUrl;

                        if (
                          direction.ignitionStatus === "ON" &&
                          direction.speed > 0 &&
                          direction.noDataTime === "00:00:00"
                        ) {
                          iconUrl = gT;
                        } else if (
                          (direction.ignitionStatus === "OFF" ||
                            direction.ignitionStatus === "ON") &&
                          direction.speed === 0 &&
                          direction.noDataTime === "00:00:00"
                        ) {
                          iconUrl = yT;
                        } else if (
                          direction.ignitionStatus === "OFF" &&
                          direction.speed === 0 &&
                          direction.noDataTime !== "00:00:00" 
                        ) {
                          iconUrl = rT;
                        }
                        return (
                          <Marker
                            key={index}
                            position={{
                              lat: latitude,
                              lng: longitude,
                            }}
                            onClick={() => {
                              setSelectedMarker(direction);
                            }}
                            icon={{
                              url: iconUrl,
                              scaledSize: new window.google.maps.Size(25, 25),
                            }}
                            visible={showMapPinnedVehicles} 
                          />
                        );
                      }
                      return null; 
                    })}
                  {selectedMarker && (
                    <InfoWindow
                      position={{
                        lat: parseFloat(selectedMarker.latitude),
                        lng: parseFloat(selectedMarker.longitude),
                      }}
                      onCloseClick={() => {
                        setSelectedMarker(null);
                      }}
                    >
                      <div>
                        <h2>Marker Info</h2>
                        <p>Latitude: {selectedMarker.latitude}</p>
                        <p>Longitude: {selectedMarker.longitude}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default MapHome;