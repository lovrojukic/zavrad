
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

        // Remove existing alerts, if any
        var stariDiv = document.getElementsByClassName('alert-container')[0];
        if (stariDiv && stariDiv.parentElement) {
            stariDiv.parentElement.removeChild(stariDiv);
        }

        try {
            console.log("Submitting:", ime, prezime, email, lozinka);

            // Update the request to match your new signup endpoint and data format
            const response = await axios.post("https://palacinkapp.onrender.com/api/auth/signup", {
                name: `${ime} ${prezime}`, // Assuming you want to combine first and last name
                username: email, // Or any username logic you want
                email: email,
                password: lozinka
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle the response based on your new authentication system
            if (response.status === 201) {
                alert("Registracija uspješna");
                window.location.replace("/login"); // Redirect to login page
            } else {
                // Handle other HTTP statuses appropriately
                alert("Registracija neuspjesna: " + response.data.message);
            }
        } catch (err) {
            // Handle errors from the server or network issues
            alert("Registracija neuspjesna: " + err.message);
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