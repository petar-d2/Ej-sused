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

const Mapa = ({ predefinedLocations = {}, zoom = 13 }) => {
  return (
    <MapContainer center={[45.796, 15.945]} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {Object.keys(predefinedLocations).map((key) => (
        <Marker key={key} position={predefinedLocations[key]} icon={icon}>
          <Popup>{key}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa;
