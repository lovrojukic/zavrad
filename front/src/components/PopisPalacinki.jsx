import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import './AddPancake.css';

const PopisPalacinki = (props) => {
    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const [palacinke, setPalacinke] = useState([]);

    useEffect(() => {
        const fetchPalacinke = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('https://palacinkapp.onrender.com/api/resursi/palacinke', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const pancakesData = response.data;

                // Fetch toppings for each pancake
                const pancakesWithToppings = await Promise.all(pancakesData.map(async (pancake) => {
                    const toppingsResponse = await axios.get(`https://palacinkapp.onrender.com/api/resursi/palacinke-dodaci/palacinka/${pancake.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log(toppingsResponse.data);
                    return {...pancake, dodaci: toppingsResponse.data};
                }));

                setPalacinke(pancakesWithToppings);
            } catch (error) {
                console.error('Error fetching pancake data:', error);
            }
        };

        fetchPalacinke();
    }, []);

    return (
        <div className="ponuda-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <h2>Popis Palacinki</h2>
            <ul className="palacinke-list">
                {palacinke.map(pancake => (
                    <li key={pancake.id} className="palacinka-item">
                        <h3>{pancake.imePalacinke} - {pancake.cijenaPalacinke} eura</h3>
                        <ul>
                            {(pancake.dodaci || []).map(dodatak => (
                                <li key={dodatak.id}>
                                    {dodatak.nazivDodatka}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopisPalacinki;
