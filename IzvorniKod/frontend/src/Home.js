import React from 'react';
import './styles/home.css';
import PrikazKvarta from './PrikazKvarta';

const Home = ({kvartovi}) => {
    
    return(
        <div className="home_main">
            {kvartovi.map((kvart) => (
                <PrikazKvarta 
                    key={kvart.id}
                    kvart={kvart} />
            ))}
        </div>
    );
}

export default Home