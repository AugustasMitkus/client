import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Nav from "./Nav";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Header from "./header";

const UserList = () => {
    const navigate = useNavigate();
    // Check if the user is an admin
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first.");
            navigate("/"); // Redirect to login page if no token is found
            return;
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.auth; // Extract the role from the token

        if (userRole !== "admin") {
            alert("You do not have permission to access this page.");
            navigate("/dashboard"); // Redirect non-admin users to the dashboard
        }
    }, [navigate]);

    const [users, setUsers] = useState([]); // State to store users fetched from the backend
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [usersPerPage, setUsersPerPage] = useState(3); // State to track users per page
    const [searchKeyword, setSearchKeyword] = useState(""); // State to track the search keyword
    const [sortCriteria, setSortCriteria] = useState("byTitle"); // State to track the sorting criteria
    const [filteredAndSortedUsers, setFilteredAndSortedUsers] = useState([]); // State to store filtered and sorted users

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://yakuzaform.emoking.lol/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data); // Set the fetched users
                setFilteredAndSortedUsers(data); // Initialize filtered and sorted users
            } catch (error) {
                console.error("Error fetching users:", error.message);
            }
        };

        fetchUsers();
    }, []);

    // Calculate the users to display on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle users per page change
    const handleUsersPerPageChange = (event) => {
        setUsersPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page when users per page changes
    };

    // Handle search and sort when the button is pressed
    const handleSearchAndSort = (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page

        // Filter and sort users based on search and sorting criteria
        const updatedUsers = users
            .filter((user) =>
                user.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                user.username.toLowerCase().includes(searchKeyword.toLowerCase())
            )
            .sort((a, b) => {
                if (sortCriteria === "byTitle") {
                    return a.title.localeCompare(b.title);
                } else if (sortCriteria === "byUser") {
                    return a.username.localeCompare(b.username);
                } else if (sortCriteria === "byDate") {
                    return new Date(a.date) - new Date(b.date);
                } else if (sortCriteria === "byReplies") {
                    return b.replies - a.replies;
                } else if (sortCriteria === "byLikes") {
                    return b.likes - a.likes;
                }
                return 0;
            });

        setFilteredAndSortedUsers(updatedUsers);
        setCurrentPage(1); // Reset to the first page when search/sort is applied
    };

    const handleProfileClick = (userId) => {
        console.log("User ID:", userId); // Log the user ID for debugging
        navigate(`/profile/${userId}`);
    };

    return (
        <>
            <Header />
            <Nav />
            <main className="threadList">
                <center>
                    <h1 className="listTitle">Browse Users</h1>
                </center>
                <form className="listForm" onSubmit={handleSearchAndSort}>
                    <article>
                        <label htmlFor="keyword" className="searchLbl">Search</label>
                        <input
                            type="text"
                            name="keyword"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            style={{ width: "100%", height: "30px", padding: "5px" }}
                        />
                        <label htmlFor="sorting" className="searchLbl">Sort By</label>
                        <select
                            name="sorting"
                            id="sorting"
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                            style={{ width: "100%", height: "30px", padding: "5px" }}
                        >
                            <option value="byNem">Username</option>
                            <option value="byEmail">Email</option>
                            <option value="byDate">Registration Date</option>
                            <option value="byPosts">Post Amount</option>
                        </select>
                        <button className="listBtn" type="submit" name="search">Search/Sort</button>
                    </article>
                    <article>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "280px" }}>Username</th>
                                    <th>Email</th>
                                    <th>Registration date</th>
                                    <th>Posts created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.id}>
                                        <th
                                            style={{ cursor: "pointer", textDecoration: "none" }}
                                            onClick={() => handleProfileClick(user.id)}
                                        >
                                            {user.username}
                                        </th>
                                        <th>{user.email}</th>
                                        <th>{user.created_at}</th>
                                        <th>{user.post_count}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Pagination>
                                {[...Array(Math.ceil(filteredAndSortedUsers.length / usersPerPage)).keys()].map((pageNumber) => (
                                    <Pagination.Item
                                        key={pageNumber + 1}
                                        active={pageNumber + 1 === currentPage}
                                        onClick={() => handlePageChange(pageNumber + 1)}
                                    >
                                        {pageNumber + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                            <div>
                                <label htmlFor="usersPerPage" style={{ marginRight: "10px" }}>Users per page:</label>
                                <select
                                    id="usersPerPage"
                                    value={usersPerPage}
                                    onChange={handleUsersPerPageChange}
                                    style={{ height: "30px", padding: "5px" }}
                                >
                                    <option value="3">3</option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        </div>
                    </article>
                </form>
            </main>
        </>
    );
};

export default UserList;