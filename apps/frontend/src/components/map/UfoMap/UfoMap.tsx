import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useUfoStore } from '../../../store/StoreContext';
import { MAP_CONFIG } from '../../../utils/constants';
import { UfoMarker } from '../UfoMarker/UfoMarker';

export const UfoMap = observer(function UfoMap() {
  const ufoStore = useUfoStore();
  const ufoList = ufoStore.ufoList;

  return (
    <Box sx={{ flexGrow: 1, position: 'relative' }}>
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ufoList.map((ufo) => (
          <UfoMarker key={`${ufo.id}-${ufo.status}`} ufo={ufo} />
        ))}
      </MapContainer>
    </Box>
  );
});
