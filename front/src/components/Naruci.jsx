import React, { useEffect, useState } from 'react';
import Header from "./Header";
import axios from "axios";
import Cookies from "js-cookie";
import "./AddPancake.css";
import {Link} from "react-router-dom";


function Naruci( props ) {
    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const [palacinke, setPalacinke] = useState([]);
    const [kosarica, setKosarica] = useState([]);
    const [adresa, setAdresa] = useState('');
    const [dostava, setDostava] = useState(true);

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

    const povecajKolicinu = (imePalacinke) => {
        setKosarica(prevKosarica => prevKosarica.map(stavka =>
            stavka.ime === imePalacinke ? { ...stavka, kolicina: stavka.kolicina + 1 } : stavka
        ));
    };

    const smanjiKolicinu = (imePalacinke) => {
        setKosarica(prevKosarica => {
            if (prevKosarica.find(stavka => stavka.ime === imePalacinke).kolicina === 1) {
                return prevKosarica.filter(stavka => stavka.ime !== imePalacinke);
            } else {
                return prevKosarica.map(stavka =>
                    stavka.ime === imePalacinke ? { ...stavka, kolicina: stavka.kolicina - 1 } : stavka
                );
            }
        });
    };

    const izracunajUkupnuCijenu = () => {
        const ukupnaCijena = kosarica.reduce((ukupno, stavka) => ukupno + stavka.cijena * stavka.kolicina, 0);
        return ukupnaCijena;
    };

    const posaljiNarudzbu = async () => {
        try {
            const pancakeOrder = kosarica.map(item => {
                // Default to an empty array if dodaci is not defined
                const dodaciList = item.dodaci || [];
                return {
                    imePalacinke: item.ime,
                    cijenaPalacinke: parseFloat(item.cijena).toFixed(2),
                    dodaci: dodaciList.map(dodatak => ({
                        nazivDodatka: dodatak.naziv,
                        cijenaDodatka: parseFloat(dodatak.cijena).toFixed(2)
                    }))
                };
            });

            const narudzba = {
                cijenaNarudzbe: izracunajUkupnuCijenu().toFixed(2),
                dostava: dostava.toString(),
                adresa: adresa,
                palacinke: pancakeOrder
            };

            console.log("Podaci koji se šalju:", narudzba);
            const token = localStorage.getItem('jwtToken');
            await axios.post('https://palacinkapp.onrender.com/api/resursi/narudzbe/add', narudzba, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert("Narudžba poslana!");
            setKosarica([]);
            setAdresa('');
        } catch (error) {
            console.error('Greška prilikom slanja narudžbe:', error);
            alert("Došlo je do greške prilikom slanja narudžbe.");
        }
    };


    return (
        <div className="ponuda-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <h2>Ponuda Palacinki</h2>
            <ul className="palacinke-list">
                {palacinke.map(pancake => (
                    <li key={pancake.id} className="palacinka-item">
                        {pancake.imePalacinke} - {pancake.cijenaPalacinke} eura
                        <button onClick={() => dodajUKosaricu(pancake)}>Dodaj u košaricu</button>
                    </li>
                ))}
            </ul>
            <div className="kosarica">
                <h3>Košarica</h3>
                <ul>
                    {kosarica.map(stavka => (
                        <li key={stavka.ime}>
                            {stavka.ime} - {stavka.kolicina}x - {stavka.cijena} eura
                            <button onClick={() => povecajKolicinu(stavka.ime)}>+</button>
                            <button onClick={() => smanjiKolicinu(stavka.ime)}>-</button>
                        </li>
                    ))}
                </ul>
                <p>Ukupna cijena: {izracunajUkupnuCijenu()} eura</p>
                {izracunajUkupnuCijenu() > 0 && (
                    <>
                        <div className="narudzba-forma">
                            <input
                                type="text"
                                placeholder="Unesite adresu dostave"
                                value={adresa}
                                onChange={(e) => setAdresa(e.target.value)}
                            />
                            <label>
                                <input
                                    type="radio"
                                    name="dostava"
                                    checked={dostava}
                                    onChange={() => setDostava(true)}
                                />
                                Dostava
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="dostava"
                                    checked={!dostava}
                                    onChange={() => setDostava(false)}
                                />
                                Preuzimanje
                            </label>
                        </div>
                        <button onClick={posaljiNarudzbu} className="auth-button">Naručite!</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Naruci;
