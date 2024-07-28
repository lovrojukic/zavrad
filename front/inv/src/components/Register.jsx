
import axios from 'axios';
import { Link } from 'react-router-dom';


import {useState} from "react";

function Register() {
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');


    async function save(event) {
        event.preventDefault();

        var stariDiv = document.getElementsByClassName('alert-container')[0];
        if (stariDiv && stariDiv.parentElement) {
            stariDiv.parentElement.removeChild(stariDiv);
        }
        try {
            console.log("Submitting:", ime, prezime, email, lozinka);
            await axios.post("/api/registracija", {
                ime: ime,
                prezime: prezime,
                email: email,
                lozinka: lozinka,
                uloga: "korisnik"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert("Registracija uspješna");
            window.location.replace("/");
        } catch (err) {
            alert("Registracija neuspjesna");
        }
    }

    return (
        <div className="centered-wrapper">
            <div className="register-container">
                <h2>Create a new account</h2>
                <form onSubmit={save} id="moj">
                    <div className="form-group">
                        <label htmlFor="ime">Ime:</label>
                        <input
                            type="text"
                            id="ime"
                            value={ime}
                            onChange={(event) => setIme(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prezime">Prezime:</label>
                        <input
                            type="text"
                            id="prezime"
                            value={prezime}
                            onChange={(event) => setPrezime(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lozinka">Password:</label>
                        <input
                            type="password"
                            id="lozinka"
                            value={lozinka}
                            onChange={(event) => setLozinka(event.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <Link to="/login">Already have an account? Log in</Link>
                    </div>
                    <div className="form-group">
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Register;