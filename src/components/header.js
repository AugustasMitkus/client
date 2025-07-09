import React from 'react';
import { Helmet } from 'react-helmet';

const Header = () => {
    //header kur įterpti keywords
    return (
        <>
            <Helmet>
                <meta name="keywords" content="forum, discussion, community, topics, yakuza, videogame, video-game, video, game, kiryu, kazuma, goro, majima" />
                <title>Forum System</title>
            </Helmet>
        </>
    );
};

export default Header;