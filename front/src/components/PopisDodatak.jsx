import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import './AddPancake.css';

const PopisDodatak = (props) => {
    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const [dodatci, setDodatci] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const fetchDodatci = async () => {
            try {
                const response = await axios.get('https://palacinkapp.onrender.com/api/resursi/dodaci', { headers });
                setDodatci(response.data);
            } catch (error) {
                console.error('Error fetching add-ons:', error);
            }
        };

        fetchDodatci();
    }, []);

    return (
        <div className="page-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className="register-container">
                <h2>Lista Dodataka</h2>
                <div className="form-group">
                    <table>
                        <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Cijena</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dodatci.map((dodatak) => (
                            <tr key={dodatak.id}>
                                <td>{dodatak.nazivDodatka}</td>
                                <td>    {parseFloat(dodatak.cijenaDodatka).toFixed(2)} eura</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PopisDodatak;
