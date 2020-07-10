import { FilePath } from './definitions/interfaces';
import { Common } from './classes';

export const boardBackgroundPaths: Readonly<FilePath[]> = [
  'beach.jpg',
  'grass.jpg',
  'hill.jpg',
  'meadow.jpg',
  'sea.jpg',
  'storm.jpg',
].map(Common.prependResourcePath);
