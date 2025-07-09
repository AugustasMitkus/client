import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./Nav";
import Likes from "./Likes";
import Pic from "./images/blank-profile.jpg";
import Pagination from "react-bootstrap/Pagination";
import Header from "./header";
import { jwtDecode } from "jwt-decode";

const Replies = () => {
    const token = localStorage.getItem("token");
    const userRole = token ? jwtDecode(token).auth : null; // Decode the token to get the user role
    const [replyList, setReplyList] = useState([]);
    const [thread,setThread] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const repliesPerPage = 3; // Maximum replies per page
    const { threadId } = useParams(); // Get thread ID from URL
    const navigate = useNavigate();
    const [reply, setReply] = useState("");
    const [includeSignature, setIncludeSignature] = useState(false); // Track if signature is included

    useEffect(() => {
        const fetchThreadAndReplies = async () => {
            try {
                // Fetch thread details
                const threadResponse = await fetch(`https://yakuzaform.emoking.lol/threads/${threadId}`);
                if (!threadResponse.ok) {
                    throw new Error("Failed to fetch thread details");
                }
                const threadData = await threadResponse.json();
                setThread(threadData);
                const repliesResponse = await fetch(`https://yakuzaform.emoking.lol/replies/${threadId}`);
                if (!repliesResponse.ok) {
                    throw new Error("Failed to fetch replies");
                }
                const repliesData = await repliesResponse.json();
                setReplyList(repliesData);
            } catch (error) {
                console.error("Error fetching thread or replies:", error.message);
            }
        };

        fetchThreadAndReplies();
    }, [threadId]);

    // Calculate the replies to display on the current page
    const indexOfLastReply = currentPage * repliesPerPage;
    const indexOfFirstReply = indexOfLastReply - repliesPerPage;
    const currentReplies = replyList.slice(indexOfFirstReply, indexOfLastReply);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleProfileClick = (user_id) => {
        navigate(`/profile/${user_id}`);
    }

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            const response = await fetch(`https://yakuzaform.emoking.lol/replies/${threadId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reply, includeSignature }), // Send the reply content
            });

            if (!response.ok) {
                throw new Error("Failed to submit reply");
            }

            const data = await response.json();
            console.log(data.message); // Log success message
            setReply(""); // Clear the reply input

            // Refresh the replies list
            const repliesResponse = await fetch(`https://yakuzaform.emoking.lol/replies/${threadId}`);
            const repliesData = await repliesResponse.json();
            setReplyList(repliesData);
        } catch (error) {
            console.error("Error submitting reply:", error.message);
        }
    };

    const handleDeleteThread = async () => {
        if (window.confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://yakuzaform.emoking.lol/threads/${threadId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to delete thread.");
                }
    
                alert("Thread deleted successfully.");
                navigate("/list"); // Redirect to the thread list after deletion
            } catch (error) {
                console.error("Error deleting thread:", error.message);
                alert("An error occurred while deleting the thread.");
            }
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (window.confirm("Are you sure you want to delete this reply? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://yakuzaform.emoking.lol/replies/${replyId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to delete reply.");
                }
    
                alert("Reply deleted successfully.");
                // Refresh the replies list
                const repliesResponse = await fetch(`https://yakuzaform.emoking.lol/replies/${threadId}`);
                const repliesData = await repliesResponse.json();
                setReplyList(repliesData);
            } catch (error) {
                console.error("Error deleting reply:", error.message);
                alert("An error occurred while deleting the reply.");
            }
        }
    };

    return (
        <>
            <Header />
            <Nav />
            <main className="replies">
                <a href="/#/list" className="back">
                    Back to threads
                </a>
                <article>
                    <div className="thread__container">
                        <div className="thread__left">
                            <h3>{thread.title}</h3>
                            <p>{new Date(thread.created_at).toLocaleDateString()}</p>
                            <div className="threadText">
                                <p>{thread.content}</p>
                            </div>
                            <Likes initialLikes={thread.likes}  
                            type="thread"
                            id={threadId}
                            token={localStorage.getItem("token")}/> {/* Likes for the thread */}
                            {userRole === "admin" && (
                            <button className="deleteBtn" onClick={handleDeleteThread}>
                                Delete Thread
                            </button>
                        )}
                        </div>
                        <div className="thread__right">
                            <img style={{ cursor: "pointer" }} src={Pic} alt="User" className="userPic" onClick={() => handleProfileClick(thread.user_id)} />
                            <p>Created by: {thread.username}</p>
                            <p>Posts Created: {thread.postsCreated}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmitReply}>
                        <label htmlFor="reply">Reply to the thread</label>
                        <textarea
                            rows={5}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            type="text"
                            name="reply"
                            className="modalInput"
                            required
                        />
                        <div className="checkbox">
                            <label htmlFor="signature">Include Signature</label>
                            <input type="checkbox" name="signature" id="signature" checked={includeSignature}
                            onChange={(e) => setIncludeSignature(e.target.checked)}/>
                        </div>
                        <button className="modalBtn">SEND</button>
                    </form>
                    <h1 className="repliesTitle">Replies</h1>
                    {currentReplies.map((reply) => (
                        <div className="thread__container" key={reply.id}>
                            <div className="thread__left">
                                <p>{new Date(reply.date).toLocaleDateString()}</p>
                                <p className="threadText">{reply.reply}</p>
                                <Likes initialLikes={reply.likes} 
                                type="reply"
                                id={reply.id}
                                token={localStorage.getItem("token")}/> {/* Likes for each reply */}
                                {userRole === "admin" && (
                                    <button className="deleteBtn" onClick={() => handleDeleteReply(reply.id)}>
                                        Delete Reply
                                    </button>
                                )}
                            </div>
                            <div className="thread__right">
                                <img style={{ cursor: "pointer" }} src={Pic} alt="User" className="userPic" onClick={() => handleProfileClick(reply.user_id)}/>
                                <p>Created by: {reply.username}</p>
                                <p>Posts Created: {reply.postsCreated}</p>
                            </div>
                        </div>
                    ))}
                    <Pagination>
                        {[...Array(Math.ceil(replyList.length / repliesPerPage)).keys()].map((pageNumber) => (
                            <Pagination.Item
                                key={pageNumber + 1}
                                active={pageNumber + 1 === currentPage}
                                onClick={() => handlePageChange(pageNumber + 1)}
                            >
                                {pageNumber + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </article>
            </main>
        </>
    );
};

export default Replies;