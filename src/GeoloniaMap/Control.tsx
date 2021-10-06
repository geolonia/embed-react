import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import type { IControl } from 'maplibre-gl';
import type geolonia from '@geolonia/embed';
import { GeoloniaMapContext } from './GeoloniaMap';

type Props = {
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  onAdd?: IControl['onAdd'];
  onRemove?: IControl['onRemove'];
}

interface IPortalControl extends IControl {
  portal: React.ReactPortal;
}

export const Control: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [portalControl, setPortalControl] = useState<IPortalControl | null> (null);
  const [controlContainer] = useState<HTMLElement>(document.createElement('div'));
  const map = useContext(GeoloniaMapContext);
  const { children, position, onAdd, onRemove } = props;

  // setup
  useEffect(() => {
    controlContainer.classList.add('mapboxgl-ctrl', 'mapboxgl-ctrl-group');
  }, [controlContainer.classList]);

  useEffect(() => {
    const PortalControl = class implements IControl {
      public portal: React.ReactPortal
      onAdd(map: geolonia.Map) {
        return onAdd ? onAdd(map) : controlContainer;
      }
      onRemove(map: geolonia.Map) {
        onRemove && onRemove(map);
      }
    };
    setPortalControl(new PortalControl());
  }, [controlContainer, onAdd, onRemove]);

  useEffect(() => {
    if (!map) return;
    map.addControl(portalControl, position);
  }, [portalControl, map, position]);

  // cleanup
  useEffect(() => () => {
    map.removeControl(portalControl);
    controlContainer.remove();
  }, [controlContainer, map, portalControl]);

  return controlContainer && ReactDOM.createPortal(children, controlContainer);
};

export default Control;
