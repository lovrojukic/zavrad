// Login.jsx
import React, { useState } from 'react';
import Cookies from 'js-cookie';


function Login(props) {
    const onLogin = props.onLogin;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    async function authenticate(e) {
        e.preventDefault();

        const body = `username=${username.toLowerCase()}&password=${password}`;
        const options = {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        };

        try {
            const response = await fetch('http://localhost:8080/login', options);
            if (response.ok) {
                Cookies.set('user', 'authenticated');
                localStorage.setItem('username', username.toLowerCase());
                localStorage.setItem('name', response.headers.get('X-Name'));
                alert('Prijava uspješna');
                onLogin();
                window.location.replace('/');
            } else {
                // Handle non-successful response here
                console.error('Authentication failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="centered-wrapper">
            <div className="container">
                <h2>Log in</h2>
                <form onSubmit={authenticate} id="moj">
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <a href="/forgot-password">Forgot your password?</a>
                    </div>

                    <div>
                        <button name="prijava" type="submit">
                            Prijavi se
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
