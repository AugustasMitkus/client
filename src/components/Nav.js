import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Pic from "./images/yakuza.png";
import { jwtDecode } from "jwt-decode";

const Nav = () => {
    let navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userId = token ? jwtDecode(token).id : null; // Decode the token to get the user ID
    const userRole = token ? jwtDecode(token).auth : null; // Decode the token to get the user role

    const checkTokenExpiration = () => {
       
        if (!token) return; // If no token, do nothing
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
             // Token has expired
            localStorage.removeItem("token"); // Remove the token
            alert("Your session has expired. Please log in again.");
            navigate("/"); // Redirect to login page
        }
    };

    useEffect(() => {
        if (!token) {
            alert("You need to log in first.");
            navigate("/"); // Redirect to login page if no token is found
        }
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 30000); // kas 30 sekundziu tikrina
        return () => clearInterval(interval); // Cleanup interval on component unmount
    });
    const goHome = () => {
        navigate('/dashboard');
    }
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the token from localStorage
        alert("You have been logged out.");
        navigate("/"); // Redirect to the login page
    };
    return (
        <nav className='navbar'>
            <img src={Pic} alt="Yakuza" className='logo' onClick={goHome} />
            <div className='navbarRight'>
                {userRole === "admin" && (
                    <a href="/#/users">Users</a> // Render the "Users" button for admin users
                )}
                <a href="/#/dashboard">Home</a>
                <div className="dropdown">
                    <button className="dropbtn">Menu
                    </button>
                    <div className="dropdown-content">
                        <a href="/#/create">Create a thread</a>
                        <a href="/#/list">Browse threads</a>
                    </div>
                </div>
                <a href={`/#/profile/${userId}`}>Profile</a>
                <button onClick={handleLogout}>Sign out</button>

            </div>
        </nav>
        
    );
};

export default Nav;