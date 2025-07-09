import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Pic from "./images/blank-profile.jpg";
import Header from "./header";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

    // Get the current user's ID from the token
    const token = localStorage.getItem("token");
    const currentUserId = token ? jwtDecode(token).id : null;
    const userRole = token ? jwtDecode(token).auth : null; // Decode the token to get the user role
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`https://yakuzaform.emoking.lol/profile/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUser(data); // Set the fetched user data
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };

        fetchUser();
    });
    const handleEditProfile = () => {
        navigate(`/edit-profile/${userId}`); // Redirect to the edit profile page
    };
    const handleDeleteUser = async () => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                const response = await fetch(`https://yakuzaform.emoking.lol/users/${userId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token for authentication
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to delete user.");
                }

                alert("User deleted successfully.");
                if (currentUserId === parseInt(userId)) {

                    localStorage.removeItem("token"); // Remove the token from localStorage
                    navigate("/");
                }
                else {
                    navigate("/users");
                }
            } catch (error) {
                console.error("Error deleting user:", error.message);
                alert("An error occurred while deleting the user.");
            }
        }
    };
    
    return (
        <>
            <Header />
            <Nav />
            <main className='profile'>
                <h2 className='profileTitle'>Profile</h2>
                <div className="profile__container">
                    <div className="profile__left">
                        <img src={Pic} alt="Profile" className="profilePic"/>
                    </div>
                    <div className="profile__right">
                        <h3>{user.username}</h3>
                        <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
                        <p>Posts: {user.post_count}</p>
                        <p>Biography:</p>
                        <p className="bioText">{user.biography}</p>
                        <p>Favorite Yakuza Game: </p>
                        <p className="bioText">{user.fav_game}</p>
                        <p>Favorite Character: </p>
                        <p className="bioText">{user.fav_char}</p>
                        
                        {(userRole === "admin" || currentUserId === parseInt(userId))  && (
                            <>
                            <button className="profileBtn" onClick={handleEditProfile}>
                                Edit Profile
                            </button>
                            <button className="profileBtn" onClick={handleDeleteUser}>
                                Delete Profile
                            </button>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Profile;