
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import Cookies from 'js-cookie';
import AddArticle from './components/AddArticle.jsx';
import Ponuda from "./components/Ponuda";
import Racun from "./components/Racun";
import PopisArtikala from "./components/PopisArtikala";

import Narudžbenica from "./components/Narudžbenica";
import Primka from "./components/Primka";

const App = () => {

    return (

        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage/>}
                />

                <Route path="/addArticle" element={<AddArticle/>} />
                <Route path="/ponuda" element={<Ponuda/>} />
                <Route path="/racun" element={<Racun/>} />
                <Route path="/popisArtikala" element={<PopisArtikala/>} />
                <Route path="/narudžbenica" element={<Narudžbenica/>} />
                <Route path="/primka" element={<Primka/>} />

            </Routes>
        </Router>
    );
};


export default App;