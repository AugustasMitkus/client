import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import Header from "./header";


const Home = () => {
    const [description, setDescription] = useState("");
    const [rules, setRules] = useState([]);
    const [player, setPlayer] = useState("");
    const [vidTitle, setVidTitle] = useState("");
    useEffect(() => {
    const getPar = async () => {
        try {
            const response = await fetch("https://yakuzaform.emoking.lol/home/info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setDescription(data.data);
                setRules(data.rules);
            } else {
                console.error("Failed to fetch data from server.");
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };
    getPar();
    const getVideo = async () => {
        try {
            const response = await fetch("https://yakuzaform.emoking.lol/youtube/video/rL-OoVxc6NU", )
            if (response.ok) {
                const data = await response.json();
                setPlayer(data.embedHtml);
                setVidTitle(data.title);
            } else {
                console.error("Failed to fetch data from server.");
            }
        }
        catch (error) {
            console.error("Error:", error.message);
        }
    }
    getVideo();
    }, []);
    //pavadinimas, pastraipa apie forumą, taisyklės
    return (
        <>
            <Header />
            <Nav />
            <main className='home'>
                <center>
                <h2 className='homeTitle'>Welcome to the Yakuza Forum</h2>
                <div className="paraText">{description}</div>
                <h3 className='homeTitle'>Forum Rules</h3>
                <div className="paraText">
                    {rules.map((rule, index) => (
                        <p key={index}>{rule}</p>
                    ))}
                    </div>
                <h3 className='homeTitle'>{vidTitle}</h3>
                <div dangerouslySetInnerHTML={{ __html: player }}/>
                </center>
            </main>
        </>
    );
};

export default Home;