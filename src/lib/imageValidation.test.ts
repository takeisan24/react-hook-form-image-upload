import { describe, expect, it } from 'vitest';
import { MAX_FILE_SIZE } from './constants';
import { imageRules, isAcceptedType, isWithinSizeLimit } from './imageValidation';

const makeFile = (name: string, type: string, size = 1024) =>
  new File([new Uint8Array(size)], name, { type });

const asFileList = (...files: File[]) => files as unknown as FileList;

describe('isAcceptedType', () => {
  it('accepts JPG and PNG files', () => {
    expect(isAcceptedType(makeFile('photo.jpg', 'image/jpeg'))).toBe(true);
    expect(isAcceptedType(makeFile('photo.JPEG', 'image/jpeg'))).toBe(true);
    expect(isAcceptedType(makeFile('photo.png', 'image/png'))).toBe(true);
  });

  it('rejects other types', () => {
    expect(isAcceptedType(makeFile('photo.gif', 'image/gif'))).toBe(false);
    expect(isAcceptedType(makeFile('photo.webp', 'image/webp'))).toBe(false);
    expect(isAcceptedType(makeFile('doc.pdf', 'application/pdf'))).toBe(false);
  });

  it('rejects files whose extension does not match the type', () => {
    expect(isAcceptedType(makeFile('script.exe', 'image/png'))).toBe(false);
  });
});

describe('isWithinSizeLimit', () => {
  it('accepts files up to 5 MB', () => {
    expect(isWithinSizeLimit(makeFile('a.png', 'image/png', MAX_FILE_SIZE))).toBe(true);
  });

  it('rejects files over 5 MB', () => {
    expect(isWithinSizeLimit(makeFile('a.png', 'image/png', MAX_FILE_SIZE + 1))).toBe(false);
  });
});

describe('imageRules messages', () => {
  const { fileType, fileSize } = imageRules.validate;

  it('returns a message for an invalid type', () => {
    expect(fileType(asFileList(makeFile('a.gif', 'image/gif')))).toBe(
      'Only JPG and PNG images are allowed.',
    );
  });

  it('returns a message for a file that is too large', () => {
    expect(fileSize(asFileList(makeFile('a.png', 'image/png', MAX_FILE_SIZE + 1)))).toBe(
      'Image must be 5 MB or smaller.',
    );
  });

  it('defers empty input to the required rule', () => {
    expect(fileType(null)).toBe(true);
    expect(fileSize(asFileList())).toBe(true);
  });
});
