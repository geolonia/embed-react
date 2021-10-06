import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { IControl } from 'maplibre-gl';
import type geolonia from '@geolonia/embed';

type Props = {
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  mapRef?: React.MutableRefObject<geolonia.Map | null>;
  onAdd?: IControl['onAdd'];
  onRemove?: IControl['onRemove'];
}

interface IPortalControl extends IControl {
  portal: React.ReactPortal;
}

export const Control: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [portalControl, setPortalControl] = useState<IPortalControl | null> (null);
  const { children, position, mapRef, onAdd, onRemove } = props;

  useEffect(() => {
    const PortalControl = class implements IControl {
      private container: HTMLDivElement = document.createElement('div')
      public portal: React.ReactPortal
      constructor() {
        this.container.classList.add('mapboxgl-ctrl');
        this.portal = ReactDOM.createPortal(children, this.container);
      }
      onAdd(map: geolonia.Map) {
        if (onAdd) {
          return onAdd(map);
        } else {
          return this.container;
        }
      }
      onRemove(map: geolonia.Map) {
        if (onRemove) {
          onRemove(map);
        }
      }
    };
    setPortalControl(new PortalControl());
  }, [children, onAdd, onRemove]);

  useEffect(() => {
    if (!mapRef || !mapRef.current) return;
    mapRef.current.addControl(portalControl, position);
  }, [portalControl, mapRef, position]);

  return <>{portalControl?.portal}</>;
};

export default Control;

// TODO: remove control したい
