import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await fetch("https://yakuzaform.emoking.lol/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Success message
                localStorage.setItem("token", data.token); // Store the token
                navigate("/dashboard"); // Redirect to the dashboard
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error); // Error message
                console.error(errorData.error); // Log the error message
            }
        } catch (error) {
            console.error("Error:", error.message);
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <main className='login'>
                <h1 className='loginTitle'>Log into your account</h1>
                <form className='loginForm' onSubmit={handleSubmit}>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='loginBtn'>SIGN IN</button>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <p>
                        Don't have an account? <Link to='/register'>Create one</Link>
                    </p>
                </form>
            </main>
        </>
    );
};
export default Login;