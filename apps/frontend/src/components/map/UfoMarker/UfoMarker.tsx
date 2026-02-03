import { memo, useState, useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import type { Ufo } from '../../../types/ufo';
import { createRotatedUfoIcon } from './utils/createUfoIconFromImage';

interface UfoMarkerProps {
  ufo: Ufo;
}

export const UfoMarker = memo(function UfoMarker({ ufo }: UfoMarkerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  const icon = createRotatedUfoIcon(ufo.heading, ufo.status === 'lost', zoom);

  return <Marker position={[ufo.lat, ufo.lng]} icon={icon} />;
});
