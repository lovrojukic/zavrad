// Login.jsx
import React, { useState } from 'react';
import Cookies from 'js-cookie';


function Login(props) {
    const onLogin = props.onLogin;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function authenticate(e) {
        e.preventDefault();

        const loginData = {
            usernameOrEmail: username.toLowerCase(),
            password: password
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        };

        try {
            const response = await fetch('https://palacinkapp.onrender.com/api/auth/signin', options);
            if (response.ok) {
                console.log(response);
                const data = await response.json();
                // Store the JWT token in local storage or cookies
                localStorage.setItem('jwtToken', data.accessToken);
                alert('Prijava uspješna');
                const role = data.role;
                Cookies.set('user', 'authenticated');
                localStorage.setItem('username', username.toLowerCase());
                localStorage.setItem('name', response.headers.get('Name'));
                localStorage.setItem('userRole', role);
                console.log(role);
                onLogin();
                window.location.replace('/');
            } else {
                // Handle non-successful response here
                alert('Authentication failed: Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Authentication failed: ' + error.message);
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
