import { Box } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MAP_CONFIG } from '../../../utils/constants';
import { UfoMarkersLayer } from './UfoMarkersLayer';

export function UfoMap() {
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
        <UfoMarkersLayer />
      </MapContainer>
    </Box>
  );
}
