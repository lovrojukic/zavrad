import React, {} from 'react';
import Header from './components/Header';

import {Link} from "react-router-dom";

import './HomePage.css';

const HomePage = () => {

    return (
        <div className="page-container">
            <Header/>
            <main className="main-content centered">
                <div className="welcome-message">
                    <h1 className="welcome-title">Dobrodošli!</h1>
                </div>

                <div className="auth-buttons">
                    <Link to="/addArticle" className="auth-link">
                        <button className="auth-button">Dodajte artikl</button>
                    </Link>
                    <Link to="/narudžbenica" className="auth-link">
                        <button className="auth-button">Narudžbenica</button>
                    </Link>
                    <Link to="/primka" className="auth-link">
                        <button className="auth-button">Primka</button>
                    </Link>
                    <Link to="/ponuda" className="auth-link">
                        <button className="auth-button">Ponuda</button>
                    </Link>

                    <Link to="/racun" className="auth-link">
                        <button className="auth-button">Račun</button>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;