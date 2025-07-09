import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Header from "./header";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        biography: "",
        fav_game: "",
        fav_char: "",
        signature: "",
    });
    const navigate = useNavigate();
    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Get the current user's ID from the token
    const token = localStorage.getItem("token");
    const currentUserId = token ? jwtDecode(token).id : null;
    const userRole = token ? jwtDecode(token).auth : null; // Decode the token to get the user role
    const { userId } = useParams(); // Get user ID from URL



    useEffect(() => {
        if (!token) {
            alert("You need to log in first.");
            navigate("/"); // Redirect to login page if no token is found
            return;
        }

        if (currentUserId !== parseInt(userId) && userRole !== "admin") {
            alert("You do not have permission to edit this profile.");
            navigate("/dashboard"); // Redirect unauthorized users to the dashboard
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await fetch(`https://yakuzaform.emoking.lol/edit/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setFormData({
                    biography: data.biography || "",
                    fav_game: data.fav_game || "",
                    fav_char: data.fav_char || "",
                    signature: data.signature || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };

        fetchUser();
    }, [userId, token, currentUserId, userRole, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://yakuzaform.emoking.lol/edit/${currentUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            navigate(`/profile/${currentUserId}`); // Redirect back to the profile page
        } catch (error) {
            console.error("Error updating profile:", error.message);
        }
    };
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!currPassword || !newPassword) {
            alert("Please fill in both fields.");
            return;
        }
        if (currPassword === newPassword) {
            alert("New password cannot be the same as the current password.");
            return;
        }
        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }
        try {
            const response = await fetch(`https://yakuzaform.emoking.lol/edit/${currentUserId}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currPassword, newPassword }),
            });

            if (!response.ok) {
                throw new Error("Failed to update password");
            }

            alert("Password changed successfully!");
        } catch (error) {
            console.error("Error changing password:", error.message);
            if (error.message === "Failed to update password") {
                alert("Current password is incorrect.");
            } else {
                alert("An error occurred while changing the password. Please try again.");
            }
        }
    }
    return (
        <>
            <Header />
            <Nav />
            <main className="profile">
                <h2 className="profileTitle">Edit Your Profile</h2>
                <div className="profile__container" style={{ flexDirection: "column" }}>
                    <form className="profileForm" onSubmit={handlePasswordChange}>
                    <label>
                        Current Password:
                        <input
                            type="password"
                            name="currentPassword"
                            value={currPassword}
                            onChange = {(e) => setCurrPassword(e.target.value)}
                        />
                    </label>
                    <label>
                        New Password:
                        <input
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange= {(e) => setNewPassword(e.target.value)}
                        />
                    </label>
                    <button type="passwordChange" className="profileBtn_edit">
                        Change Password
                    </button>
                    </form>
                <form className="profileForm" onSubmit={handleSubmit}>
                    <label>
                        Biography:
                        <textarea
                            name="biography"
                            value={formData.biography}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Favorite Yakuza Game:
                        <input
                            type="text"
                            name="fav_game"
                            value={formData.fav_game}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Favorite Character:
                        <input
                            type="text"
                            name="fav_char"
                            value={formData.fav_char}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Signature:
                        <textarea
                            name="signature"
                            value={formData.signature}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" className="profileBtn_edit">
                        Save Changes
                    </button>
                </form>
                </div>
            </main>
        </>
    );
};

export default EditProfile;