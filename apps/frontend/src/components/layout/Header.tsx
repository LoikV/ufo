import { observer } from 'mobx-react-lite';
import { Box, Typography, Chip, Button } from '@mui/material';
import { useUfoStore } from '../../store/StoreContext';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header = observer(function Header({ onLogout }: HeaderProps) {
  const ufoStore = useUfoStore();

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5">UFO Tracker</Typography>

      <Chip
        label={`Active: ${ufoStore.activeCount}`}
        variant="outlined"
        size="small"
      />

      {ufoStore.lostCount > 0 && (
        <Chip
          label={`Lost: ${ufoStore.lostCount}`}
          variant="outlined"
          size="small"
        />
      )}

      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={handleLogout}
        sx={{ ml: 'auto' }}
      >
        Log out
      </Button>
    </Box>
  );
});
