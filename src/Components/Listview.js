import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';




const SpecificationModal = ({ isOpen, onClose, selectedVehicledata }) => {

  console.log("check", selectedVehicledata);

  const { driverName, latitude, longitude, speed, direction } = selectedVehicledata;

  return (
    <div className={`fixed inset-0 ${isOpen ? '' : 'hidden'} overflow-y-auto z-50 `}>
      <div className=" min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute w-full inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 "> 
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button onClick={onClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 py-1 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                Close
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg mt-4 leading-6 font-medium text-gray-900" id="modal-title">
                  Specification Details
                </h3>
                <div className="mt-4">
                  {/* Display selected data */}
                  <p>Driver Name: {driverName}</p>
                  <p>Latitude: {latitude}</p>
                  <p>Longitude: {longitude}</p>
                  <p>Speed: {speed}</p>
                  <p>Direction: {direction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const VehicleDataTable = ({Direction}) => {
  const [vehicleData, setVehicleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  console.log("Direction", Direction)
  
  useEffect(() => {
    setVehicleData(Direction)
    setFilteredData(Direction)
  }, [Direction]);

  const handleSpecificationClick = (data) => {
    setSelectedVehicle(data);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };


  function getVehicleColorClass(data) {
    if (
      data.speed > 0 &&
      data.ignitionStatus === "ON" &&
      data.noDataTime === "00:00:00"
    ) {
      return "text-green-500"; 
    } else if (
      data.speed === 0 &&
      (data.ignitionStatus === "ON" || data.ignitionStatus === "OFF") &&
      data.noDataTime === "00:00:00"
    ) {
      return "text-amber-500"; 
    } else {
      return "text-red-500"; 
    }
  }

  const getCellColorClass = (value) => {
    if (value > 0) {
      return 'text-green-500'; // Green color for positive values
    } else if (value === 0) {
      return 'text-red-500'; // Amber color for zero values
    } else {
      return 'text-amber-500'; // Red color for negative values
    }
  };

  const handleSearch = (key, value) => {
    const searchValue = value.toLowerCase(); // Convert search value to lowercase
  
    // Filter data based on search value
    const newData = vehicleData.filter((item) => {
      // Check if the property value is a string and convert to lowercase before comparison
      if (typeof item[key] === 'string' && item[key].toLowerCase().includes(searchValue)) {
        return true; // If match found, include this item in filtered data
      }
      // For numeric fields like 'id' and 'speed', convert to string and then check for inclusion
      if ((key === 'id' || key === 'speed') && item[key].toString().includes(searchValue)) {
        return true;
      }
      return false; // If no match found for any key, exclude this item from filtered data
    });
  
    setFilteredData(newData); // Update filtered data state
  };
  

  return (
    <div className="m-4 mx-auto bg-white ">
      <table className="w-full overflow-y-auto text-sm">
        <thead className="sticky top-0 bg-sky-800">
          <tr>
            <th className="border px-2 py-1">
             
              <input
                type="text"
                className='rounded w-6 text-center p-1'
                placeholder=" ID"
                onChange={(e) => handleSearch('id', e.target.value)}
              />
            </th>
            <th className="border px-2 py-1">
            
              <input
                type="text"
                className='rounded w-20 text-center p-1'

                placeholder=" Vehicle"
                onChange={(e) => handleSearch('shortName', e.target.value)}
              />
            </th>
            <th className="border px-2 py-1">
             
              <input
                type="text"
                className='rounded w-20 text-center p-1'

                placeholder=" Time"
                onChange={(e) => handleSearch('lastseen', e.target.value)}
              />
            </th>
          
              <th className="border px-2 py-2">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder=" Geofence"
                onChange={(e) => handleSearch('insideGeoFence', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder=" Location"
                onChange={(e) => handleSearch('address', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder=" Speed"
                onChange={(e) => handleSearch('speed', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder="Alert"
                onChange={(e) => handleSearch('alert', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder="Ignition"
                onChange={(e) => handleSearch('ignitionStatus', e.target.value)}
              /></th>
              <th className="border px-2 py-1"> 
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder="Battery"
                onChange={(e) => handleSearch('powerStatus', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder="Driver Name"
                onChange={(e) => handleSearch('driverName', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder="Remarks"
                onChange={(e) => handleSearch('remarks', e.target.value)}
              /></th>
              <th className="border px-2 py-1">
              <input
                type="text"
                className='rounded w-24 text-center p-1'

                placeholder=" Specification"
                onChange={(e) => handleSearch('lastseen', e.target.value)}
              /></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data, index) => (
            <tr key={index} className="text-center">
              <td className="border px-2 py-1">{index+1}</td>
              <td className={`border px-2 py-1 ${getVehicleColorClass(data)}`}>
                <b>{data.shortName} </b></td>
              <td className="border px-2 py-1">{data.lastseen}</td>
              {/* <td className="border px-2 py-1">{data.latitude}</td>
                <td className="border px-2 py-1">{data.longitude}</td> */}
                <td className="border px-2 py-1">{data.insideGeoFence}</td>
                <td className="border px-2 py-1">{data.address}</td>
                {/* <td className="border px-2 py-1">{data.speed}kmpl</td> */}
                <td className={`border px-2 py-1 ${getCellColorClass(data.speed)}`}>
                <b>{data.speed}kmpl</b></td>

                <td className="border px-2 py-1">{data.alert}</td>
                {/* <td className="border px-2 py-1">{data.ignitionStatus}</td> */}
                <td className={`border px-2 py-1 ${data.ignitionStatus === 'OFF' ? 'text-red-500' : 'text-green-500'}`}>
  <b>{data.ignitionStatus}</b>
</td>
                <td className="border px-2 py-1">{data.powerStatus}</td>
                <td className="border px-2 py-1">{data.driverName}</td>
                <td className="border px-2 py-1">{data.remarks}</td>
                <td className="border px-2 py-1">
                <FontAwesomeIcon
                  icon={faEye}
                  onClick={() => handleSpecificationClick(data)}
                  className="ml-1 text-blue-800 hover:text-blue-400 cursor-pointer hover:text-lg"
                /> {/* Added Font Awesome icon */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedVehicle && (
        <SpecificationModal isOpen={true} onClose={handleCloseModal} selectedVehicledata={selectedVehicle} />
      )}
    </div>
  );
};

export default VehicleDataTable;