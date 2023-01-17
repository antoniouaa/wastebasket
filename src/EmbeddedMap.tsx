import React from "react";
import L, { LatLngExpression, Icon } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";

interface ChangeMapProps {
  center: LatLngExpression;
  zoom?: number;
  isMapChanging?: boolean;
}

interface MapCircleProps {
  layer: L.Circle;
}

const ChangeCenter = ({ center, zoom }: ChangeMapProps) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);

  return null;
};

const ChangeRadius = ({
  center,
  zoom,
  layer,
}: ChangeMapProps & MapCircleProps) => {
  const map = useMap();
  React.useEffect(() => {
    if (layer) layer.addTo(map);
    layer.setLatLng(center);
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
  const [radiusLayer] = React.useState<L.Circle>(
    new L.Circle(position, {
      radius: 500,
      color: "#89cff0",
      fillColor: "#89cff0",
      fillOpacity: 0.25,
    })
  );
  const zoom: number = 16;

  React.useEffect(() => {
    handleCurrentLocation();
  }, []);

  const handleCurrentLocation = (_?: React.MouseEvent) => {
    navigator.geolocation.getCurrentPosition((p) => {
      const { latitude, longitude } = p.coords;
      setPosition([latitude, longitude]);
      setMarks(new Map(marks).set([latitude, longitude], "You are here!"));
    });
  };

  const handleCenterMap = () => {
    setRecenter(true);
    setInterval(() => {
      setRecenter(false);
    }, 500);
  };

  const markers = Array.from(marks)
    .slice(1)
    .map(([pos, label], i) => (
      <Marker
        key={JSON.stringify(pos) + i}
        position={pos}
        icon={
          new Icon({
            iconUrl: markerIconPng,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })
        }>
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
        {<ChangeRadius center={position} zoom={zoom} layer={radiusLayer} />}
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
