import type { Map } from '@geolonia/embed';
import { Meta } from '@storybook/react';
import React, { useCallback, useLayoutEffect, useState } from 'react';
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

  type ControlTemplate = {
    type: 'button' | 'text' | 'select' | 'label'
    position: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  }

  const [controls, setControls] = useState<ControlTemplate[]>([]);
  const types = ['button', 'text', 'label'];
  const positions = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

  const handleAppendControl = useCallback(() => {
    const control = {
      type: (document.getElementById('select-type') as HTMLSelectElement).value,
      position: (document.getElementById('select-position') as HTMLSelectElement).value,
    } as ControlTemplate;
    setControls([...controls, control]);
  }, [controls]);

  return (
    <div className="flex">

      <form className="sidebar">
        <select name="control-type" id="select-type">
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select name="position" id="select-position">
          {
            positions.map((position) => <option key={position} value={position}>{position}</option>)
          }
        </select>
        <button type={'button'} onClick={handleAppendControl}>{'コントロールを追加'}</button>
      </form>

      <GeoloniaMap
        lng={TokyoYamanoteLineStations[0][1]}
        lat={TokyoYamanoteLineStations[0][2]}
        zoom={'16'}
        className="geolonia-80"
        marker={'off'}
      >
        {controls.map((control, i) => <GeoloniaMap.Control
          key={i}
          position={control.position}
          containerProps={ { className: 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group' } }
        >
          {
            control.type === 'button' ? <button>{`${i + 1}`}</button> :
              control.type === 'label' ? <span>{`Hello ${i + 1}`}</span> :
                control.type === 'text' ? <input type="text" placeholder={`Hello ${i + 1}`} /> : null
          }
        </GeoloniaMap.Control>)}

      </GeoloniaMap>
    </div>
  );
};

export const GeoJSONWithSimpleStyle = () => (
  <GeoloniaMap
    className="geolonia"
    geojson="https://gist.githubusercontent.com/miya0001/56c3dc174f5cdf1d9565cbca0fbd3c48/raw/c13330036d28ef547a8a87cb6df3fa12de19ddb6/test.geojson"
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

export const ChangeProps = () => {
  const [onoff, setOnoff] = useState<string>('on');

  return (
    <div>
      <p>Currently displaying: {onoff}</p>
      <button onClick={() => setOnoff('on')}>Set render3d = on</button>
      <button onClick={() => setOnoff('off')}>Set render3d = off</button>

      <GeoloniaMap
        className="geolonia"
        mapStyle="geolonia/basic"
        lat="35.68116"
        lng="139.764992"
        zoom="16"
        render3d={onoff}
      />
    </div>
  );
};

export const WithinComponent = () => {
  const WrapperComponent: React.FC<{idx: number}> = ({idx}) => {
    return (
      <div>
        <h3>Hello, map {idx}!</h3>
        <GeoloniaMap
          className="geolonia"
          mapStyle="geolonia/basic"
          lat="35.68116"
          lng="139.764992"
          zoom="16"
          render3d="on"
        />
      </div>
    );
  };

  const [sel, setSel] = useState<number>(0);

  return (
    <div>
      <p>Currently displaying: {sel}</p>
      <button onClick={() => setSel(0)}>Switch to 0</button>
      <button onClick={() => setSel(1)}>Switch to 1</button>
      <button onClick={() => setSel(2)}>Switch to 2</button>

      <WrapperComponent idx={sel} />
    </div>
  );
};
