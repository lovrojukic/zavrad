import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import './AddPancake.css';  // Možete promijeniti ime CSS datoteke ako želite

const PopisArtikala = (props) => {
    const { isLoggedIn, onLogout } = props;
    const [artikli, setArtikli] = useState([]);

    useEffect(() => {
        const fetchArtikli = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/article', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setArtikli(response.data);
            } catch (error) {
                console.error('Error fetching article data:', error);
            }
        };

        fetchArtikli();
    }, []);

    return (
        <div className="ponuda-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <h2>Popis Artikala</h2>
            <ul className="artikli-list">
                {artikli.map(artikl => (
                    <li key={artikl.id} className="artikl-item">
                        <h3>{artikl.name} - {artikl.price} eura</h3>
                        <p>Količina: {artikl.amount}</p>
                        <p>Dobavljač: {artikl.supplier}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopisArtikala;
