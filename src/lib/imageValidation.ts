import type { RegisterOptions } from 'react-hook-form';
import { ACCEPTED_IMAGE_TYPES, CROP_SIZE, MAX_FILE_SIZE } from './constants';

export function isAcceptedType(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type) && /\.(jpe?g|png)$/i.test(file.name);
}

export function isWithinSizeLimit(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      reject(new Error('Unable to read image'));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  });
}

// Rules run in order and stop at the first failure, so later checks can assume
// the earlier ones passed (e.g. dimensions are only read from a valid image file).
export const imageRules = {
  required: 'Please upload an image.',
  validate: {
    fileType: (files) =>
      !files?.[0] || isAcceptedType(files[0]) || 'Only JPG and PNG images are allowed.',
    fileSize: (files) =>
      !files?.[0] || isWithinSizeLimit(files[0]) || 'Image must be 5 MB or smaller.',
    dimensions: async (files) => {
      if (!files?.[0]) return true;
      try {
        const { width, height } = await getImageDimensions(files[0]);
        return (
          (width >= CROP_SIZE && height >= CROP_SIZE) ||
          `Image must be at least ${CROP_SIZE}×${CROP_SIZE} pixels (this one is ${width}×${height}).`
        );
      } catch {
        return 'This file could not be read as an image.';
      }
    },
  },
} satisfies RegisterOptions<{ image: FileList | null }, 'image'>;
