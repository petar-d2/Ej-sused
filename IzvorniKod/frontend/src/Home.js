import React, { useContext } from 'react';
import './styles/home.css';
import PrikazKvarta from './PrikazKvarta';
import { GlobalContext } from './GlobalContext';
import Mapa from './Mapa';

const Home = () => {
  const predefinedLocations = {
    'Trešnjevka': [45.796, 15.945],
    'Maksimir': [45.829, 16.018],
    'Dubrava': [45.817, 16.067],
    'Žitnjak': [45.794, 16.058],
    'Trnje': [45.801, 15.974],
    'Črnomerec': [45.821, 15.933],
    'Vrapče': [45.837, 15.910],
    'Novi Zagreb': [45.770, 15.977],
    'Medveščak': [45.818, 15.988],
  };
  const { kvartovi } = useContext(GlobalContext);

  return (
    <div className="home_main">
        <div className='mapa'>
        <Mapa predefinedLocations={predefinedLocations} />
        </div>
        <div className='kvartovi_home'>
            {kvartovi.map((kvart) => (
            <PrikazKvarta key={kvart.id} kvart={kvart} />
        
      ))}
      </div>
    </div>
  );
};

export default Home;
