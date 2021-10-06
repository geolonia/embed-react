import type { Map } from '@geolonia/embed';
import { Meta } from '@storybook/react';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import GeoloniaMap from './GeoloniaMap';
import './GeoloniaMap.stories.css';

export default {
  title: 'GeoloniaMap',
} as Meta;

export const Defaults = () => (
  <GeoloniaMap
    className="geolonia"
    apiKey="YOUR-API-KEY"
  />
);

export const SimpleMarker = () => (
  <GeoloniaMap
    className="geolonia"
    lat="35.681236"
    lng="139.767125"
    zoom="16"
    markerColor="#555"
  />
);

const TokyoYamanoteLineStations: [string, string, string][] = [
  ['東京駅', '139.766103', '35.681391'],
  ['有楽町駅', '139.763806', '35.675441'],
  ['新橋駅', '139.758587', '35.666195'],
  ['浜松町駅', '139.757135', '35.655391'],
  ['田町駅', '139.747575', '35.645736'],
  ['品川駅', '139.738999', '35.62876'],
  ['大崎駅', '139.728439', '35.619772'],
  ['五反田駅', '139.723822', '35.625974'],
  ['目黒駅', '139.715775', '35.633923'],
  ['恵比寿駅', '139.71007', '35.646685'],
  ['渋谷駅', '139.701238', '35.658871'],
  ['原宿駅', '139.702592', '35.670646'],
  ['代々木駅', '139.702042', '35.683061'],
  ['新宿駅', '139.700464', '35.689729'],
  ['新大久保駅', '139.700261', '35.700875'],
  ['高田馬場駅', '139.703715', '35.712677'],
  ['目白駅', '139.706228', '35.720476'],
  ['池袋駅', '139.711086', '35.730256'],
  ['大塚駅', '139.728584', '35.731412'],
  ['巣鴨駅', '139.739303', '35.733445'],
  ['駒込駅', '139.748053', '35.736825'],
  ['田端駅', '139.761229', '35.737781'],
  ['西日暮里駅', '139.766857', '35.731954'],
  ['日暮里駅', '139.771287', '35.727908'],
  ['鶯谷駅', '139.778015', '35.721484'],
  ['上野駅', '139.777043', '35.71379'],
  ['御徒町駅', '139.774727', '35.707282'],
  ['秋葉原駅', '139.773288', '35.698619'],
  ['神田駅', '139.770641', '35.691173'],
];

export const MarkerWithPopup = () => {
  const [ count, setCount ] = useState(-1);

  useLayoutEffect(() => {
    let timeout: number;
    const tick = () => {
      setCount((count) => count + 1);
      timeout = window.setTimeout(tick, 5_000);
    };
    tick();
    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const [name, lng, lat] = TokyoYamanoteLineStations[ Math.max(0, count) % TokyoYamanoteLineStations.length ];

  return (
    <GeoloniaMap
      className="geolonia"
      lat={lat}
      lng={lng}
      openPopup="on"
      zoom="12"
    >
      <h3>{name}</h3>
    </GeoloniaMap>
  );
};

export const AllControls = () => (
  <GeoloniaMap
    className="geolonia"
    lat="34.704395"
    lng="135.494771"
    zoom="14"
    navigationControl="on"
    geolocateControl="on"
    fullscreenControl="on"
    scaleControl="on"
  >
    グランフロント
  </GeoloniaMap>
);

export const CustomControls = () => {
  const mapRef = useRef<Map | null>(null);
  const handleSampleControlAction = useCallback(() => { alert('world'); }, []);

  return (
    <GeoloniaMap className="geolonia" mapRef={mapRef}>
      <GeoloniaMap.Control position={'top-left'} mapRef={mapRef}>
        <button onClick={handleSampleControlAction}>{'hello'}</button>
      </GeoloniaMap.Control>
    </GeoloniaMap>
  );
};

export const GeoJSONWithSimpleStyle = () => (
  <GeoloniaMap
    className="geolonia"
    lat="33.897"
    lng="135.639"
    zoom="10"
    geojson="https://raw.githubusercontent.com/wakayama-pref-org/list-of-public-facilities/master/JSON/list-of-public-facilities.geojson"
    marker="off"
  />
);

export const VectorTileWithSimpleStyle = () => (
  <GeoloniaMap
    className="geolonia"
    simpleVector="https://tileserver.geolonia.com/embed-simple-vector-sample/tiles.json"
    marker="off"
  />
);

export const Enable3D = () => (
  <GeoloniaMap
    className="geolonia"
    mapStyle="geolonia/basic"
    lat="35.68116"
    lng="139.764992"
    zoom="16"
    render3d="on"
  />
);

export const Disable3D = () => (
  <GeoloniaMap
    className="geolonia"
    mapStyle="geolonia/gsi"
    lat="35.68116"
    lng="139.764992"
    zoom="16"
    render3d="off"
  />
);

export const CustomJavaScript = () => {
  const onLoad = useCallback((map: Map) => {
    let animator: number | undefined = undefined;
    const doRotate = () => {
      map.rotateTo( map.getBearing() + 0.1 );
      animator = window.requestAnimationFrame(doRotate);
    };
    doRotate();

    return () => {
      if (typeof animator !== 'undefined')
        window.cancelAnimationFrame(animator);
    };
  }, []);
  return (
    <GeoloniaMap
      className="geolonia"
      mapStyle="geolonia/basic"
      lat="35.68116"
      lng="139.764992"
      zoom="16"
      render3d="on"
      onLoad={onLoad}
    />
  );
};
