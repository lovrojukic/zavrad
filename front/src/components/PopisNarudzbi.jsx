import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import './AddPancake.css';

const PopisNarudzbi = (props) => {
    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const [narudzbe, setNarudzbe] = useState([]);

    useEffect(() => {
        const fetchNarudzbe = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('https://palacinkapp.onrender.com/api/resursi/narudzbe', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Fetch pancakes and their toppings for each order
                const narudzbeWithDetails = await Promise.all(response.data.map(async (narudzba) => {
                    const pancakesResponse = await axios.get(`https://palacinkapp.onrender.com/api/resursi/palacinke-narudzbe/narudzba/${narudzba.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const pancakesWithToppings = await Promise.all(pancakesResponse.data.map(async (pancake) => {
                        const toppingsResponse = await axios.get(`https://palacinkapp.onrender.com/api/resursi/palacinke-dodaci/palacinka/${pancake.id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        return {...pancake, dodaci: toppingsResponse.data};
                    }));

                    return {...narudzba, palacinke: pancakesWithToppings};
                }));

                setNarudzbe(narudzbeWithDetails);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchNarudzbe();
    }, []);

    return (
        <div className="ponuda-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <h2>Popis Narudžbi</h2>
            <ul className="narudzbe-list">
                {narudzbe.map(narudzba => (
                    <li key={narudzba.id} className="narudzba-item">
                        <h3>Narudžba id: {narudzba.id}</h3>
                        <p>{narudzba.cijenaNarudzbe} eura</p>
                        <p>Dostava: {narudzba.dostava ? 'Potrebna dostava' : 'Dostava nije potrebna'}</p>
                        <p>Adresa: {narudzba.adresa}</p>
                        <ul>
                            {narudzba.palacinke.map(palacinka => (
                                <li key={palacinka.id}>
                                    <p>{palacinka.imePalacinke} - {palacinka.cijenaPalacinke} eura</p>
                                    <ul>
                                        {palacinka.dodaci.map(dodatak => (
                                            <li key={dodatak.id}>{dodatak.nazivDodatka}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopisNarudzbi;
