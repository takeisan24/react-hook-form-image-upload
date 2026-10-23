import { useState, type ChangeEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { CROP_SIZE } from '../lib/constants';
import { imageRules } from '../lib/imageValidation';
import { CropPreview } from './CropPreview';
import { ImageCropper } from './ImageCropper';

type FormValues = {
  image: FileList | null;
  croppedImage: File | null;
};

// The native file input stays in the DOM (React Hook Form needs its ref) but is hidden
// behind an MUI button, following the MUI "file upload" pattern.
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function croppedFileName(name: string): string {
  const dot = name.lastIndexOf('.');
  return `${name.slice(0, dot)}-${CROP_SIZE}x${CROP_SIZE}${name.slice(dot)}`;
}

function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageUploadForm() {
  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    clearErrors,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { image: null, croppedImage: null } });

  // The uploaded file, set only once it has passed validation.
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const sourceUrl = useObjectUrl(sourceFile);
  const selectedFile = watch('image')?.[0];

  const { onChange: onImageChange, ...imageField } = register('image', imageRules);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    await onImageChange(event);
    setSourceFile(null);
    setUploadedFile(null);
    setValue('croppedImage', null);
    clearErrors('croppedImage');

    const isValid = await trigger('image');
    // Ignore the result if another file was picked while this one was validating.
    if (isValid && getValues('image')?.[0] === file) setSourceFile(file);
  };

  const onSubmit = async ({ croppedImage }: FormValues) => {
    const formData = new FormData();
    formData.append('image', croppedImage!);
    // Simulated request; replace with e.g. fetch('/api/upload', { method: 'POST', body: formData }).
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadedFile(croppedImage);
  };

  const handleReset = () => {
    reset();
    setSourceFile(null);
    setUploadedFile(null);
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: 480 }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack component="form" spacing={3} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Typography variant="h5" component="h1" gutterBottom>
              Upload image
            </Typography>
            <Typography variant="body2" color="text.secondary">
              JPG or PNG, up to 5 MB. The image is cropped to {CROP_SIZE} × {CROP_SIZE} pixels.
            </Typography>
          </div>

          <FormControl error={!!errors.image}>
            <FormLabel htmlFor="image" required sx={{ mb: 1 }}>
              Image
            </FormLabel>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Button
                component="label"
                variant="outlined"
                color={errors.image ? 'error' : 'primary'}
                sx={{ flexShrink: 0 }}
              >
                Choose file
                <VisuallyHiddenInput
                  id="image"
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  aria-invalid={errors.image ? 'true' : 'false'}
                  aria-describedby="image-helper"
                  {...imageField}
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" noWrap>
                {selectedFile?.name ?? 'No file chosen'}
              </Typography>
            </Stack>
            <FormHelperText id="image-helper" role={errors.image ? 'alert' : undefined} sx={{ mx: 0 }}>
              {errors.image?.message ?? 'Accepted: JPG, PNG. Max size: 5 MB.'}
            </FormHelperText>
          </FormControl>

          <Controller
            name="croppedImage"
            control={control}
            rules={{
              validate: (file, { image }) =>
                !image?.length || !!file || 'Please crop the image before submitting.',
            }}
            render={({ field, fieldState }) => (
              <>
                {sourceFile && sourceUrl && (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel component="span">
                      Crop image ({CROP_SIZE} × {CROP_SIZE} px)
                    </FormLabel>
                    <FormHelperText sx={{ mx: 0, mt: 0, mb: 1 }}>
                      Drag to reposition, scroll or use the slider to zoom.
                    </FormHelperText>
                    <ImageCropper
                      key={sourceUrl}
                      src={sourceUrl}
                      fileName={croppedFileName(sourceFile.name)}
                      mimeType={sourceFile.type}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <FormHelperText role="alert" sx={{ mx: 0 }}>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
                <CropPreview file={field.value} />
              </>
            )}
          />

          <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="inherit" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              Upload
            </Button>
          </Stack>

          {uploadedFile && (
            <Alert severity="success">
              Uploaded {uploadedFile.name} ({formatBytes(uploadedFile.size)}, {CROP_SIZE} ×{' '}
              {CROP_SIZE} px).
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
