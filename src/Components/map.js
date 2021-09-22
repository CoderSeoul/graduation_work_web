import React from 'react';

const center = { lat: 36.372322109441434, lng: 127.36035109956234 };

function MapScreen({ deviceList, setDeviceId }) {
  const [map, setMap] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [infowindow, setInfoWindow] = React.useState(false);

  const initMap = () => {
    let loaded = document.getElementById('map');
    if (loaded) {
      const m = new window.google.maps.Map(loaded, {
        center,
        zoom: 15,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });
      setMap(m);
    }
  };

  const makeInfoWindow = () => {
    if (deviceList !== undefined && map !== null) {
      map.setCenter({
        lat: deviceList[0].latitude,
        lng: deviceList[0].longitude,
      });
      deviceList.forEach((item) => {
        const position = { lat: item.latitude, lng: item.longitude };

        const marker = new window.google.maps.Marker({
          position,
          map,
        });
        marker.addListener('click', (e) => {
          setDeviceId(item.id);
        });
      });
    }
  };

  React.useEffect(initMap, []);
  React.useEffect(makeInfoWindow, [map]);

  return (
    <>
      <div id="map" style={{ width: '100vw', height: '40vh' }} />
    </>
  );
}

export default MapScreen;
