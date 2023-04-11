import React, { useState, useMemo, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import type { IControl } from 'maplibre-gl';
import type geolonia from '@geolonia/embed';
import { GeoloniaMapContext } from './GeoloniaMap';

type Props = {
  /** where to put the control */
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

  /** fire before the control added to map */
  onAdd?: IControl['onAdd'];

  /** fire after the control removeed to map */
  onRemove?: IControl['onRemove'];

  /** Picked HTMLDivElement attributes for container element of the control */
  containerProps?: {

    /** Class attribute values for the container element. If you want to use the embed class names such as `maplibregl-ctrl` or `mapboxgl-ctrl`, please refer the link below.
     *  https://github.com/maplibre/maplibre-gl-js/search?l=CSS&q=maplibregl-ctrl&type=code
     */
    className?: React.HTMLAttributes<HTMLDivElement>['className'];
  };
}

interface IPortalControl extends IControl {
  portal: React.ReactPortal;
}

export const Control: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [portalControl, setPortalControl] = useState<IPortalControl | null> (null);
  const controlContainer = useMemo(() => document.createElement('div'), []);
  const map = useContext(GeoloniaMapContext);
  const { children, position, onAdd, onRemove, containerProps } = props;

  // setup
  useEffect(() => {
    if (containerProps?.className) {
      const tokens = containerProps?.className.split(' ').filter((token) => !!token) || [];
      controlContainer.classList.add(...tokens);
    } else {
      controlContainer.setAttribute('class', '');
    }
  }, [containerProps?.className, controlContainer]);

  useEffect(() => {
    const PortalControl = class implements IControl {
      public portal: React.ReactPortal;
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
    if (!map || !portalControl) return;
    map.addControl(portalControl, position);
  }, [portalControl, map, position]);

  // cleanup
  useEffect(() => () => {
    if (!map || !portalControl) return;
    map.removeControl(portalControl);
    controlContainer.remove();
  }, [controlContainer, map, portalControl]);

  return controlContainer && ReactDOM.createPortal(children, controlContainer);
};

export default Control;
