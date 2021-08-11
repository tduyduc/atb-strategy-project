import React from 'react';
import { FilePath, NonEmptyArray } from './definitions/interfaces';

/** Generates a random Boolean value. */
export function randomBool(): boolean {
  return Math.random() < 0.5;
}

/**
 * Generates a random integer, from min inclusive to max exclusive.
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Generates a random element of an array. Must be a non-empty array.
 */
export function getRandomArrayElement<T>(array: readonly T[]): T | undefined {
  return array[randomInt(0, array.length)];
}

export function prependResourcePath(fileName: FilePath): FilePath {
  const PATH_PREFIX: FilePath = './res/';
  return PATH_PREFIX + fileName;
}

/**
 * `setState` and `Object.assign` wrapper with type constraints for `this.state`.
 * Returns a new state reference.
 */
export function assignStateBind<State>(
  thisArg: React.Component<unknown, State, unknown>,
): (source: Partial<State>) => void {
  return function assignState(source: Partial<State>): void {
    thisArg.setState(
      (prevState: State): State => ({ ...prevState, ...source }),
    );
  };
}
