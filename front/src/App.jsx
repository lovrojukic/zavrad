// App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import HomePage from './HomePage.jsx';
import Cookies from 'js-cookie';
import AddArticle from './components/AddArticle.jsx';
import AddPancake from "./components/AddPancake";
import Ponuda from "./components/Ponuda";
import Racun from "./components/Racun";
import PopisDodatak from "./components/PopisDodatak";
import PopisArtikala from "./components/PopisArtikala";
import PopisNarudzbi from "./components/PopisNarudzbi";
import Narudžbenica from "./components/Narudžbenica";
import Primka from "./components/Primka";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('userRole');
        Cookies.remove('user');
        setIsLoggedIn(false);
        window.location.replace('/');
    };

    return (

        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
                />
                {!isLoggedIn && <Route path="/register" element={<Register />} />}
                {!isLoggedIn && <Route path="/login" element={<Login onLogin={handleLogin} />} />}
                <Route path="/addArticle" element={<AddArticle isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/addPancake" element={<AddPancake isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/ponuda" element={<Ponuda isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/racun" element={<Racun isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/popisDodatak" element={<PopisDodatak isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/popisArtikala" element={<PopisArtikala isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/popisNarudzbi" element={<PopisNarudzbi isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/narudžbenica" element={<Narudžbenica isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
                <Route path="/primka" element={<Primka isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

            </Routes>
        </Router>
    );
};


export default App;