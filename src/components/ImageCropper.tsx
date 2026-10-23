import { useRef, useState } from 'react';
import Cropper, { type Area, type Point } from 'react-easy-crop';
import { Box, Slider, Stack, Typography } from '@mui/material';
import { cropImage } from '../lib/cropImage';
import { CROP_SIZE } from '../lib/constants';

type ImageCropperProps = {
  src: string;
  fileName: string;
  mimeType: string;
  onChange: (file: File | null) => void;
};

export function ImageCropper({ src, fileName, mimeType, onChange }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // Cropping is async; only the most recent request may update the form value.
  const latestRequest = useRef(0);

  const handleCropComplete = async (_area: Area, areaPixels: Area) => {
    const request = ++latestRequest.current;
    try {
      const file = await cropImage(src, areaPixels, CROP_SIZE, fileName, mimeType);
      if (request === latestRequest.current) onChange(file);
    } catch {
      if (request === latestRequest.current) onChange(null);
    }
  };

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 260, sm: 320 },
          overflow: 'hidden',
          bgcolor: 'grey.900',
          borderRadius: 1,
        }}
      >
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" id="zoom-label">
          Zoom
        </Typography>
        <Slider
          aria-labelledby="zoom-label"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(_event, value) => setZoom(value)}
        />
      </Stack>
    </Stack>
  );
}
