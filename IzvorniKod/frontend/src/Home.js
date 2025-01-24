import React, { useContext, useState } from 'react';
import './styles/home.css';
import PrikazKvarta from './PrikazKvarta';
import { GlobalContext } from './GlobalContext';
import Mapa from './Mapa';

const Home = () => {
    const { kvartovi } = useContext(GlobalContext);

    const [kvartoviWithMarkers, setKvartoviWithMarkers] = useState([
        { id: 1, name: "Trešnjevka", image: "/static/images/tresnjevka.jpg", coords: [45.8002, 15.9397] },
        { id: 2, name: "Maksimir", image: "/static/images/maksimir.jpg", coords: [45.8295, 16.0189] },
        { id: 3, name: "Dubrava", image: "/static/images/dubrava.jpg", coords: [45.8274, 16.0612] },
        { id: 4, name: "Trnje", image: "/static/images/trnje.jpg", coords: [45.7985, 15.9785] },
        { id: 5, name: "Žitnjak", image: "/static/images/zitnjak.jpg", coords: [45.7850, 16.0579] },
        { id: 6, name: "Črnomerec", image: "/static/images/crnomerec.jpg", coords: [45.8163, 15.9456] },
        { id: 7, name: "Vrapče", image: "/static/images/vrapce.jpg", coords: [45.8150, 15.9013] },
        { id: 8, name: "Novi Zagreb", image: "/static/images/novizg.jpg", coords: [45.7698, 15.9780] },
        { id: 9, name: "Medveščak", image: "/static/images/medvescak.jpg", coords: [45.8184, 15.9724] },
    ]);

    return (
        <div className="home_main">
            <div className="kvartovi-list">
                {kvartovi.map((kvart) => (
                    <PrikazKvarta
                        key={kvart.id}
                        kvart={kvart}
                    />
                ))}
            </div>
            <Mapa 
                lokacija={kvartoviWithMarkers.map(kvart => kvart.coords)} 
                zoom={13} 
                naslov="Zagreb"
            />
        </div>
    );
}

export default Home;
