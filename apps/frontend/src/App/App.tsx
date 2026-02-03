import { Box } from '@mui/material';
import { useUfoStore } from '../store/StoreContext';
import { useSSEConnection } from './hooks/useSSEConnection';
import { useUfoCleanup } from './hooks/useUfoCleanup';
import { Header } from '../components/layout/Header';
import { UfoMap } from '../components/map/UfoMap/UfoMap';

import 'leaflet/dist/leaflet.css';

interface AppProps {
  onLogout?: () => void;
}

export default function App({ onLogout }: AppProps) {
  const ufoStore = useUfoStore();
  useSSEConnection(ufoStore);
  useUfoCleanup(ufoStore);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onLogout={onLogout} />
      <UfoMap />
    </Box>
  );
}
