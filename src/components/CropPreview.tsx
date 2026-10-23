import { Box, FormLabel, Stack, Typography } from '@mui/material';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { CROP_SIZE } from '../lib/constants';

export function CropPreview({ file }: { file: File | null }) {
  const url = useObjectUrl(file);
  return (
    <Stack spacing={1}>
      <FormLabel component="span">Preview</FormLabel>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: '100%',
          maxWidth: CROP_SIZE,
          aspectRatio: '1',
          overflow: 'hidden',
          bgcolor: 'grey.100',
          // An outline (unlike a border) takes no space, so the image shows at full 400px.
          outline: '1px solid',
          outlineColor: 'divider',
          borderRadius: 1,
        }}
      >
        {url ? (
          <Box
            component="img"
            src={url}
            alt="Cropped image preview"
            sx={{ display: 'block', width: '100%', height: 'auto' }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Your cropped image will appear here
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
