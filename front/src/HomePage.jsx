// HomePage.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import axios from 'axios';
import {Link} from "react-router-dom";
import pancakeBackground from './photos/pancake.jpg';
import './HomePage.css';

const HomePage = (props) => {
    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const userRole = localStorage.getItem('userRole');



    return (
        <div className="page-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <main className="main-content centered">
                <div className="welcome-message">
                    <h1 className="welcome-title">Dobrodošli!</h1>
                </div>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <>
                            {userRole === 'admin' && (
                                <>
                                    <Link to="/addDodatak" className="auth-link">
                                        <button className="auth-button">Dodajte dodatak</button>
                                    </Link>
                                    <Link to="/addPancake" className="auth-link">
                                        <button className="auth-button">Dodajte palacinku</button>
                                    </Link>
                                </>
                            )}
                            <Link to="/naruci" className="auth-link">
                                <button className="auth-button">Ponuda</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="auth-link">
                                <button className="auth-button">Registracija!</button>
                            </Link>
                            <Link to="/login" className="auth-link">
                                <button className="auth-button">Prijava!</button>
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;