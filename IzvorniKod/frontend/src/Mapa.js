import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers";
import "leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

const icon = L.AwesomeMarkers.icon({
  icon: "info-sign",
  markerColor: "red",
  prefix: "glyphicon",
});


const Mapa = ({ lokacija = [45.33, 14.46], zoom = 13, naslov = "Dana lokacija" }) => {
  return (
    <MapContainer center={lokacija} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={lokacija} icon={icon}>
        <Popup>{naslov}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapa;
