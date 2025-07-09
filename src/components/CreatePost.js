import React, { useState } from "react";
import Nav from "./Nav";
import Header from "./header";

const CreatePost = () => {
    const [thread, setThread] = useState("");
    const [content, setContent] = useState("");
    const [includeSignature, setIncludeSignature] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //nenaudojama kol kas, tik pavyzdys
    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        createThread();
    };
    const createThread = () => {
        const token = localStorage.getItem("token"); // Retrieve the JWT
    
        fetch("https://yakuzaform.emoking.lol/create/thread", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include the JWT in the Authorization header
            },
            body: JSON.stringify({
                thread,
                content,
                includeSignature,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message) {
                setSuccessMessage("Thread created successfully!"); // Set success message
                setThread(""); // Clear thread input
                setContent(""); // Clear content input
                setIncludeSignature(false); // Reset checkbox
            } else {
                setErrorMessage("Failed to create thread. Please try again.");
            }
        })
        .catch((err) => {
            console.error(err);
            setErrorMessage("An error occurred. Please try again.");
        });
    };
    return (
        <>
            <Header />
            <Nav />
            <main className='post'>
                <h2 className='postTitle'>Create a thread</h2>
                <form className='postForm' onSubmit={handleSubmit}>
                    <div className='thread__container'>
                        <div className='thread__left'>
                        <label htmlFor='thread'>Title</label>
                        <input
                            type='text'
                            name='thread'
                            required
                            value={thread}
                            onChange={(e) => setThread(e.target.value)}
                        />
                        
                        <label htmlFor='postcontent'>Content</label>
                        <textarea
                            type='text'
                            name='postcontent'
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="wideInput"
                        />
                        <div className='checkbox'>
                            <input
                                name='signature'
                                type="checkbox"
                                checked={includeSignature}
                                onChange={(e) => setIncludeSignature(e.target.checked)}
                            />
                            <label htmlFor="signature">Include signature</label>
                        </div>
                        </div>

                        <button className='postBtn'>CREATE THREAD</button>
                    </div>
                </form>
                    {successMessage && <p className="success">{successMessage}</p>}
                    {errorMessage && <p className="error">{errorMessage}</p>}
            </main>
        </>
    );
};

export default CreatePost;
