import { FilePath } from './definitions/interfaces';
import { prependResourcePath } from './common-functions';

export const boardBackgroundPaths: readonly FilePath[] = [
  'beach.jpg',
  'grass.jpg',
  'hill.jpg',
  'meadow.jpg',
  'sea.jpg',
  'storm.jpg',
].map(prependResourcePath);
