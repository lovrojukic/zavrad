// Header.jsx
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";
import Sidebar from "./Sidebar";
//import Sidebar from './Sidebar'

const Header = (props) => {

    const [sidebarOpen, setSidebarOpen] = useState(false); // State to handle sidebar visibility

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen); // Toggle the state
    };

    return (
        <header className="Header">

                <div className="Header-Content">
                    <div className="Sidebar-Toggle">
                        <button onClick={toggleSidebar}>☰</button>
                        {/* Sidebar toggle button */}
                    </div>
                    {sidebarOpen && <Sidebar  className="open"/>}


                </div>
                <div>
                    <Link to="/">
                        <button>Početna</button>
                    </Link>
                    <Link to="/PopisArtikala">
                        <button>Pregled Artikala</button>
                    </Link>
                </div>

        </header>
    );
};

export default Header;