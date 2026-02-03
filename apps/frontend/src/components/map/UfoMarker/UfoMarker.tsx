import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Marker, useMap } from 'react-leaflet';
import { useUfoStore } from '../../../store/StoreContext';
import { createRotatedUfoIcon } from './utils/createUfoIconFromImage';

interface UfoMarkerProps {
  id: string;
}

export const UfoMarker = observer(function UfoMarker({ id }: UfoMarkerProps) {
  const ufoStore = useUfoStore();
  const ufo = ufoStore.ufos.get(id);
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  useEffect(() => {
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);
    return () => {
      map.off('zoomend', onZoom);
    };
  }, [map]);

  if (!ufo) return null;

  const icon = createRotatedUfoIcon(ufo.heading, ufo.status === 'lost', zoom);

  return <Marker position={[ufo.lat, ufo.lng]} icon={icon} />;
});
