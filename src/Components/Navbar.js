import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSyncAlt, FaUser, FaSignOutAlt, FaHome, FaFileAlt, FaMap, FaUserCog } from 'react-icons/fa';
import logo1 from '../assests/logo.png';
import config from "../config";
import profileImg from '../assests/profile.png';

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleLogout = async () => {
    const logoutEventData = {
      userId: user.user.user_id,
      userFirstName: user.user.user_first_name,
      userLastName: user.user.user_last_name,
      userRole: user.user.user_role,
    };
    setIsButtonDisabled(true);
    try {
      const response = await fetch(`${config.apiUrl}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logoutEventData),
      });

      const result = await response.json();

      if (response.status === 200) {
        localStorage.removeItem("user");
        navigate("/");
        setIsButtonDisabled(false);
      } else {
        console.error("Error logging logout event:", result.message);
      }
    } catch (error) {
      console.error("Error logging logout event:", error.message);
    }
  };

  return (
    <div className="flex-grow-0 font-serif ">
      <div className="flex items-center">
        <div className="leading-5">
          <h6 className="font-bold">
            <p>{user ? ` ${user.user.user_role}` : "Guest"}</p>
          </h6>
          <p>{` ${user.user.user_first_name} ${user.user.user_last_name} `}</p>
        </div>
        <img
          src={profileImg}
          alt="Profile"
          className="w-14 h-14 mr-1 rounded-full "
        />
        <div className="mt-2">
          <button
            className="bg-transparent border-none focus:outline-none"
            onClick={handleLogout}
            disabled={isButtonDisabled}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (selectedValue === "Playback") {
      navigate("/playback");
    }

    if (selectedValue === "Geofence") {
      navigate("/geofence");
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 bg-sky-800 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <img className="h-16" src={logo1} alt="Logo" />
          </div>
          <div className="hidden md:block text-center">
            <div className='flex flex-rows items-center'>
              <ul className="flex space-x-4 mr-4">
                <li>
                  <Link to="/dashboard"> Home</Link>
                </li>
                <li>
                  <select className="bg-sky-800 w-20" onChange={handleOptionChange} value={selectedOption}>
                    <option value="">Reports</option>
                    <option value="AC Report">AC Report</option>
                    <option value="Fuel Report">Fuel Report</option>
                    <option value="Overspeed">Overspeed</option>
                    <option value="Geofence Report">Geofence Report</option>
                    <option value="Ignition Report">Ignition Report</option>
                    <option value="Device Reports">Device Reports</option>
                  </select>
                </li>
                <li>
                  <select className="bg-sky-800 w-20" onChange={handleOptionChange} value={selectedOption}>
                    <option value="">Maps</option>
                    <option value="Playback">Playback</option>
                    <option value="Geofence">Geofence</option>

                  </select>
                </li>
                <li>
                  <button className="hover:text-gray-300" onClick={() => window.location.reload()}>
                    <FaSyncAlt />
                  </button>
                </li>
              </ul>
              <div>
                {user && <UserProfile user={user} />}
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <button onClick={toggleMenu} className=" focus:outline-none">
              {isOpen ? <FaSyncAlt /> : <FaUser />} {/* Display different icon based on menu state */}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="container mx-auto mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link to="/home" className="text-white hover:text-gray-300"> <FaHome /> </Link>
              </li>
              <li>
                <Link to="/report" className="text-white hover:text-gray-300"> <FaFileAlt /></Link>
              </li>
              <li>
                <Link to="/maps" className="text-white hover:text-gray-300"> <FaMap /> </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white hover:text-gray-300"> <FaUserCog /> </Link>
              </li>
              {/* Add Refresh Icon, User Name, and Logout Button */}
              <li>
                <button className="text-white hover:text-gray-300"><FaSyncAlt /> </button>
              </li>
              <li>
                <span className="text-white hover:text-gray-300">User Name</span>
              </li>
              <li>
                <button className="text-white hover:text-gray-300"><FaSignOutAlt /> </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
