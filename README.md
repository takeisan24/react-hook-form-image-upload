# Image upload form (React Hook Form)

A React + TypeScript form built with [React Hook Form](https://react-hook-form.com/) and
[MUI](https://mui.com/material-ui/) that lets a user upload an image, crop it to 400 × 400 px, and
preview the result before submitting.

## Run

```bash
npm install
npm run dev     # start the dev server
npm test        # run validation unit tests
npm run build   # type-check and build
```

## Fields and validation

| Field | Rule | Message |
| --- | --- | --- |
| Upload image | required | Please upload an image. |
| | JPG or PNG only (MIME type and extension) | Only JPG and PNG images are allowed. |
| | max 5 MB | Image must be 5 MB or smaller. |
| | at least 400 × 400 px, so the crop isn't upscaled | Image must be at least 400×400 pixels (this one is W×H). |
| Crop image | a crop must exist before submit | Please crop the image before submitting. |

The crop uses a fixed 1:1 area ([react-easy-crop](https://github.com/ValentinH/react-easy-crop)) and is
drawn onto a 400 × 400 canvas. The preview updates whenever a drag or zoom ends, and the cropped
`File` is what gets submitted.

## Structure

- `src/components/ImageUploadForm.tsx`: the form (`register` for the file input, `Controller` for the cropped image)
- `src/components/ImageCropper.tsx`: crop area and zoom slider
- `src/components/CropPreview.tsx`: 400 × 400 preview of the cropped image
- `src/lib/constants.ts`: accepted types, max size, crop size
- `src/lib/imageValidation.ts`: validation rules
- `src/lib/cropImage.ts`: canvas cropping to a `File`
- `src/hooks/useObjectUrl.ts`: object URL lifecycle for previews
