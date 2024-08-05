import React, { useEffect, useState } from 'react';
import Header from "./Header";
import axios from "axios";
import Cookies from "js-cookie";
import "./Ponuda.css";
import {Link} from "react-router-dom";


function Ponuda( props ) {
    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const [palacinke, setPalacinke] = useState([]);
    const [kosarica, setKosarica] = useState([]);

    useEffect(() => {
        const fetchPalacinke = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('https://palacinkapp.onrender.com/api/resursi/palacinke', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPalacinke(response.data);
            } catch (error) {
                console.error('Error fetching pancake data:', error);
            }
        };

        fetchPalacinke();
    }, []);

    const dodajUKosaricu = (pancake) => {
        const novaStavka = {
            ime: pancake.imePalacinke,
            cijena: pancake.cijenaPalacinke,
            kolicina: 1 // pretpostavljamo da po defaultu dodajemo jednu palačinku
        };

        // Provjeravamo postoji li već palačinka u košarici
        const postojecaStavka = kosarica.find(stavka => stavka.ime === novaStavka.ime);

        if (postojecaStavka) {
            // Ako postoji, samo povećavamo količinu
            setKosarica(kosarica.map(stavka =>
                stavka.ime === novaStavka.ime ? { ...stavka, kolicina: stavka.kolicina + 1 } : stavka
            ));
        } else {
            // Ako ne postoji, dodajemo novu stavku u košaricu
            setKosarica([...kosarica, novaStavka]);
        }
    };

    const izracunajUkupnuCijenu = () => {
        return kosarica.reduce((ukupno, stavka) => ukupno + stavka.cijena * stavka.kolicina, 0);
    };


    return (
        <div className="ponuda-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <h2>Ponuda Palacinki</h2>
            <ul className="palacinke-list">
                {palacinke.map(pancake => (
                    <li key={pancake.id} className="palacinka-item">
                        {pancake.imePalacinke} - {pancake.cijenaPalacinke} kn
                        <button onClick={() => dodajUKosaricu(pancake)}>Dodaj u košaricu</button>
                    </li>
                ))}
            </ul>
            <div className="kosarica">
                <h3>Košarica</h3>
                <ul>
                    {kosarica.map(stavka => (
                        <li key={stavka.ime}>{stavka.ime} - {stavka.kolicina}x - {stavka.cijena} kn</li>
                    ))}
                </ul>
                <p>Ukupna cijena: {izracunajUkupnuCijenu()} kn</p>
                {izracunajUkupnuCijenu() > 0 && (
                    <Link to="/naruci" className="auth-link">
                        <button className="auth-button">Naručite!</button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Ponuda;
