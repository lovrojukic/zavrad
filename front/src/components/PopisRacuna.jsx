import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import './PopisRacuna.css';

const PopisRacuna = (props) => {
    const [narudzbe, setNarudzbe] = useState([]);

    useEffect(() => {
        const fetchNarudzbe = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/order', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setNarudzbe(response.data);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchNarudzbe();
    }, []);

    return (
        <div className="racuni-container">
            <Header />
            <h2>Popis Računa</h2>
            <ul className="racuni-list">
                {narudzbe.map(narudzba => (
                    <li key={narudzba.id} className="racun-item">
                        <h3>ID Računa: {narudzba.id}</h3>
                        <p>Ukupna Cijena: {narudzba.totalPrice} eura</p>
                        <h4>Naručeni Artikli:</h4>
                        <ul>
                            {narudzba.orderItems.map(item => (
                                <li key={item.id} className="artikl-item">
                                    <p>Ime Artikla: {item.article.name}</p>
                                    <p>Cijena po komadu: {item.article.price} eura</p>
                                    <p>Količina: {item.amount}</p>
                                    <p>Ukupna Cijena za ovaj artikl: {(item.amount * item.article.price).toFixed(2)} eura</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopisRacuna;
