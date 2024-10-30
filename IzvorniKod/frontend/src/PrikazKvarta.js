import React from 'react'

const PrikazKvarta = ({kvart}) => {
  return (
    <div className="kvart" key={kvart.id}>
        <img className="kvart_slika" src={kvart.image} />
        <div className="overlay">{kvart.name}</div>
    </div>
  );
}

export default PrikazKvarta
