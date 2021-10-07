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

const TokyoYamanoteLineStations: [name: string, lng: string, lat: string, search: string][] = [
  ['東京駅', '139.766103', '35.681391', 'tokyo'],
  ['有楽町駅', '139.763806', '35.675441', 'yurakucyo'],
  ['新橋駅', '139.758587', '35.666195', 'shinbashi'],
  ['浜松町駅', '139.757135', '35.655391', 'hamamatsu'],
  ['田町駅', '139.747575', '35.645736', 'tamachi'],
  ['品川駅', '139.738999', '35.62876', 'shinagawa'],
  ['大崎駅', '139.728439', '35.619772', 'osaki'],
  ['五反田駅', '139.723822', '35.625974', 'gotanda'],
  ['目黒駅', '139.715775', '35.633923', 'meguro'],
  ['恵比寿駅', '139.71007', '35.646685', 'ebisu'],
  ['渋谷駅', '139.701238', '35.658871', 'shibuya'],
  ['原宿駅', '139.702592', '35.670646', 'harajyuku'],
  ['代々木駅', '139.702042', '35.683061', 'yoyogi'],
  ['新宿駅', '139.700464', '35.689729', 'shinjyuku'],
  ['新大久保駅', '139.700261', '35.700875', 'shinokubo'],
  ['高田馬場駅', '139.703715', '35.712677', 'takadanobaba'],
  ['目白駅', '139.706228', '35.720476', 'mejiro'],
  ['池袋駅', '139.711086', '35.730256', 'ikebukuro'],
  ['大塚駅', '139.728584', '35.731412', 'otsuka'],
  ['巣鴨駅', '139.739303', '35.733445', 'sugamo'],
  ['駒込駅', '139.748053', '35.736825', 'komagome'],
  ['田端駅', '139.761229', '35.737781', 'tabata'],
  ['西日暮里駅', '139.766857', '35.731954', 'nishinippori'],
  ['日暮里駅', '139.771287', '35.727908', 'nippori'],
  ['鶯谷駅', '139.778015', '35.721484', 'uguisudani'],
  ['上野駅', '139.777043', '35.71379', 'ueno'],
  ['御徒町駅', '139.774727', '35.707282', 'okachimachi'],
  ['秋葉原駅', '139.773288', '35.698619', 'akihabara'],
  ['神田駅', '139.770641', '35.691173', 'kanda'],
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
  const [ count, setCount ] = useState(0);
  const [ word, setWord ] = useState('');

  const selectStation = useCallback((count: number) => {
    const stationCount = TokyoYamanoteLineStations.length;
    const mod = count % stationCount;
    const index = mod < 0 ? mod + stationCount : mod;
    const station = TokyoYamanoteLineStations[index];
    const name = station[0];
    const center: [string, string] = [station[1], station[2]];
    return { name, center };
  }, []);

  const handleSeachWordChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setWord(event.target.value);
  }, []);

  const handleSearchEnter: React.KeyboardEventHandler<HTMLInputElement> = useCallback((event) => {
    if (event.code === 'Enter') {
      const stationIndex = TokyoYamanoteLineStations.findIndex((station) => {
        const stationName = station[3].toUpperCase();
        const pattern = word.toUpperCase();
        return stationName.indexOf(pattern) !== -1;
      });
      if (stationIndex !== -1) {
        setCount(stationIndex);
      }
    }
  }, [word]);

  const handleClockwiseButtonClick = useCallback(() => { setCount((count) => (count + 1)); }, []);
  const handleAntiClockwiseButtonClick = useCallback(() => { setCount((count) => count - 1); }, []);

  const station = selectStation(count);

  return (
    <GeoloniaMap
      lng={station.center[0]}
      lat={station.center[1]}
      zoom={'16'}
      className="geolonia" mapRef={mapRef}>
      <GeoloniaMap.Control
        position={'top-left'}
        containerProps={ { className: 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group' } }
      >
        <input
          style={{width: 250}}
          type="text"
          placeholder="Yamanote Station Name? e.g. tokyo"
          value={word}
          onChange={handleSeachWordChange}
          onKeyPress={handleSearchEnter}
        />
      </GeoloniaMap.Control>

      <GeoloniaMap.Control
        position={'top-left'}
        containerProps={ { className: 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group' } }
      >
        <button onClick={handleClockwiseButtonClick} aria-label={'fly to next station'}>{'→'}</button>
        <button onClick={handleAntiClockwiseButtonClick} aria-label={'fly to previous station'}>{'←'}</button>
      </GeoloniaMap.Control>
      <GeoloniaMap.Control
        position={'bottom-left'}
        containerProps={ { className: 'mapboxgl-ctrl maplibregl-ctrl mapboxgl-ctrl-attrib maplibregl-ctrl-attrib' } }
      >
        <span>{`current station: ${station.name}`}</span>
      </GeoloniaMap.Control>

      <p>{station.name}</p>
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
