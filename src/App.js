import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Replies from "./components/Replies";
import Post from "./components/CreatePost";
import PostList from "./components/PostList";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import UserList from "./components/UserList";

const App = () => {
    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/dashboard' element={<Home />} />
                    <Route path='/create' element={<Post />} />
                    <Route path='/list' element={<PostList />} />
                    <Route path='/replies/:threadId' element={<Replies />} />
                    <Route path='/profile/:userId' element={<Profile />} />
                    <Route path='/edit-profile/:userId' element={<EditProfile />} />
                    <Route path='/users' element={<UserList />} />
                </Routes>
            </HashRouter>
        </div>
    );
};

export default App;