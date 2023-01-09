import React from "react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";

interface ChangeCenterProps {
  center: LatLngExpression;
  zoom?: number;
}

const ChangeCenter = ({ center, zoom }: ChangeCenterProps) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);

  return null;
};

export const EmbeddedMap = () => {
  const [position, setPosition] = React.useState<LatLngExpression>([
    51.505, -0.09,
  ]);
  const [marks, setMarks] = React.useState<Map<LatLngExpression, string>>(
    new Map([[position, "start"]])
  );
  const [reCenter, setRecenter] = React.useState<boolean>(true);
  const zoom: number = 11;

  React.useEffect(() => {
    setInterval(() => {
      setRecenter(false);
    }, 50);
  });

  React.useEffect(() => {
    handleCurrentLocation();
  }, []);

  const handleCurrentLocation = (e?: React.MouseEvent) => {
    navigator.geolocation.getCurrentPosition((p) => {
      const { latitude, longitude } = p.coords;
      setPosition([latitude, longitude]);
      setMarks(new Map(marks).set([latitude, longitude], "Current Location"));
    });
  };

  const handleCenterMap = () => {
    setRecenter(true);
    console.log(position);
  };

  const markers = Array.from(marks)
    .slice(1)
    .map(([pos, label], i) => (
      <Marker key={JSON.stringify(pos) + i} position={pos}>
        <Popup>{label}</Popup>
      </Marker>
    ));

  return (
    <>
      <MapContainer
        className='h-screen w-screen z-0'
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}>
        {reCenter && <ChangeCenter center={position} />}
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {markers}
      </MapContainer>
      )
      <button
        className='absolute bottom-[60px] left-5 bg-blue-400 h-[35px] w-[125px] z-100 p-1 rounded text-white'
        onClick={handleCenterMap}>
        Center Map
      </button>
      <button
        className='absolute bottom-[20px] left-5 bg-blue-400 h-[35px] w-[125px] z-100 p-1 rounded text-white'
        onClick={handleCurrentLocation}>
        I am here
      </button>
    </>
  );
};
