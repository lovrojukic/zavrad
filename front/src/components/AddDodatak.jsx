//AddAdmin.jsx
import Header from './Header';
import axios from 'axios';
import {useState} from "react";
import "./AddDodatak.css";


const AddDodatak = (props) => {

    const isLoggedIn = props.isLoggedIn;
    const onLogout = props.onLogout;
    const [nazivDodatka, setNazivDodatka] = useState('');
    const [cijenaDodatka, setCijenaDodatka] = useState('');

    async function save(event) {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            console.log("Submitting:", nazivDodatka, cijenaDodatka);
            await axios.post("https://palacinkapp.onrender.com/api/resursi/dodaci/add", {
                nazivDodatka: nazivDodatka,
                cijenaDodatka: cijenaDodatka,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            alert("Dodatak uspješno dodan!");
        } catch (err) {
            var noviDiv = document.createElement('div');
            noviDiv.className = 'alert-container';
            noviDiv.textContent = err.response.data.message;
            var udiv = document.getElementsByClassName('register-container')[0];
            udiv.insertBefore(noviDiv, document.getElementById("moj"));
        }
    }

    return (
        <div className="page-container">
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <div className="register-container">
                <h2>Dodavanje dodatka</h2>
                <form onSubmit={save} id="moj">
                    <div className="form-group">
                        <label htmlFor="nazivDodatka">Ime Dodatka:</label>
                        <input
                            type="text"
                            id="nazivDodatka"
                            value={nazivDodatka}
                            onChange={(event) => setNazivDodatka(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cijenaDodatka">Cijena dodatka:</label>
                        <input
                            type="number"
                            id="cijenaDodatka"
                            value={cijenaDodatka}
                            onChange={(event) => setCijenaDodatka(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Dodaj</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AddDodatak;

