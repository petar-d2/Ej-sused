import React, { useContext } from 'react';
import './styles/home.css';
import PrikazKvarta from './PrikazKvarta';
import { GlobalContext } from './GlobalContext';

const Home = () => {

    const { kvartovi } = useContext(GlobalContext);

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

export default Home;