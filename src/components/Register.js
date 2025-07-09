import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const [errorMessage, setErrorMessage] = useState(""); // State for error message



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(""); // Clear previous success message
        setErrorMessage(""); 
        console.log("Form submitted");

        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return;
        }
        try {
            const response = await fetch("https://yakuzaform.emoking.lol/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Success message
                setEmail("");
                setUsername("");
                setPassword("");
                setSuccessMessage("Registration successful!");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error); // Error message
                console.error(errorData.error); // Error message
            }
        } catch (error) {
            console.error("Error:", error.message);
            setErrorMessage("An error occurred. Please try again.");
        }
    };
    return (
        <>
        <Header />
        <main className='register'>
            <h1 className='registerTitle'>Create an account</h1>
            <form className='registerForm' onSubmit={handleSubmit}>
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor='email'>Email Address</label>
                <input
                    type='text'
                    name='email'
                    id='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button className='registerBtn' type="submit">REGISTER</button>
                {successMessage && <p className="success">{successMessage}</p>}
                {errorMessage && <p className="error">{errorMessage}</p>}
                <p>
                    Have an account? <Link to='/'>Sign in</Link>
                </p>
            </form>
        </main>
        </>
    );
};


export default Register;