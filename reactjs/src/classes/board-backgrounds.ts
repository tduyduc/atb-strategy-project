import { FilePath, NonEmptyArray } from './definitions/interfaces';
import { prependResourcePath } from './common-functions';

export const boardBackgroundPaths = [
  'beach.jpg',
  'grass.jpg',
  'hill.jpg',
  'meadow.jpg',
  'sea.jpg',
  'storm.jpg',
].map(prependResourcePath) as NonEmptyArray<FilePath>;
