import { Box, CssBaseline } from '@mui/material';
import { ImageUploadForm } from './components/ImageUploadForm';

export default function App() {
  return (
    <>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          px: 2,
          py: { xs: 3, sm: 6 },
          bgcolor: 'grey.100',
        }}
      >
        <ImageUploadForm />
      </Box>
    </>
  );
}
