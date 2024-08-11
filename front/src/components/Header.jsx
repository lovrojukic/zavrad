// Header.jsx
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";


const Header = (props) => {

    const [sidebarOpen, setSidebarOpen] = useState(false); // State to handle sidebar visibility



    return (
        <header className="Header">

                <div className="Header-Content">



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