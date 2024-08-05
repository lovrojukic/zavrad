// HomePage.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import axios from 'axios';
import {Link} from "react-router-dom";

import './HomePage.css';

const HomePage = (props) => {

    return (
        <div className="page-container">
            <Header/>
            <main className="main-content centered">
                <div className="welcome-message">
                    <h1 className="welcome-title">Dobrodošli!</h1>
                </div>

                <div className="auth-buttons">
                    <Link to="/addDodatak" className="auth-link">
                        <button className="auth-button">Dodajte artikl</button>
                    </Link>
                    <Link to="/addPancake" className="auth-link">
                        <button className="auth-button">Ponuda</button>
                    </Link>

                    <Link to="/naruci" className="auth-link">
                        <button className="auth-button">Račun</button>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;