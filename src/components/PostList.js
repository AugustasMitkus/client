import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Header from "./header";

const PostList = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]); // State to store posts fetched from the backend
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [postsPerPage, setPostsPerPage] = useState(3); // State to track posts per page
    const [searchKeyword, setSearchKeyword] = useState(""); // State to track the search keyword
    const [sortCriteria, setSortCriteria] = useState("byTitle"); // State to track the sorting criteria
    const [filteredAndSortedPosts, setFilteredAndSortedPosts] = useState([]); // State to store filtered and sorted posts

    // Fetch posts from the backend
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("https://yakuzaform.emoking.lol/threads");
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                setPosts(data); // Set the fetched posts
                setFilteredAndSortedPosts(data); // Initialize filtered and sorted posts
            } catch (error) {
                console.error("Error fetching posts:", error.message);
            }
        };

        fetchPosts();
    }, []);

    // Calculate the posts to display on the current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle posts per page change
    const handlePostsPerPageChange = (event) => {
        setPostsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page when posts per page changes
    };

    // Handle search and sort when the button is pressed
    const handleSearchAndSort = (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page

        // Filter and sort posts based on search and sorting criteria
        const updatedPosts = posts
            .filter((post) =>
                post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                post.username.toLowerCase().includes(searchKeyword.toLowerCase())
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

        setFilteredAndSortedPosts(updatedPosts);
        setCurrentPage(1); // Reset to the first page when search/sort is applied
    };

    const handleTitleClick = (postId) => {
        console.log("Post ID:", postId); // Log the post ID for debugging
        navigate(`/replies/${postId}`);
    };

    return (
        <>
            <Header />
            <Nav />
            <main className="threadList">
                <center>
                    <h1 className="listTitle">Browse Posts</h1>
                </center>
                <form className="listForm" onSubmit={handleSearchAndSort}>
                    <article>
                        <label htmlFor="keyword" className="searchLbl">Search by Post or User</label>
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
                            <option value="byTitle">Post Title</option>
                            <option value="byUser">Username</option>
                            <option value="byDate">Post Date</option>
                            <option value="byReplies">Replies</option>
                            <option value="byLikes">Likes</option>
                        </select>
                        <button className="listBtn" type="submit" name="search">Search/Sort</button>
                    </article>
                    <article>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "280px" }}>Post Title</th>
                                    <th>Date</th>
                                    <th>Replies</th>
                                    <th>Likes</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map((post) => (
                                    <tr key={post.id}>
                                        <th
                                            style={{ cursor: "pointer", textDecoration: "none" }}
                                            onClick={() => handleTitleClick(post.id)}
                                        >
                                            {post.title}
                                        </th>
                                        <th>{post.date}</th>
                                        <th>{post.replies}</th>
                                        <th>{post.likes}</th>
                                        <th>{post.username}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Pagination>
                                {[...Array(Math.ceil(filteredAndSortedPosts.length / postsPerPage)).keys()].map((pageNumber) => (
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
                                <label htmlFor="postsPerPage" style={{ marginRight: "10px" }}>Posts per page:</label>
                                <select
                                    id="postsPerPage"
                                    value={postsPerPage}
                                    onChange={handlePostsPerPageChange}
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

export default PostList;