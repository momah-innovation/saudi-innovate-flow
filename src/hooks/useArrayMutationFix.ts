/**
 * Array Mutation Fix Hook - Provides immutable array operations
 * Prevents React anti-patterns and performance issues from direct mutations
 */

import { useCallback } from 'react';
import { logger } from '@/utils/logger';

interface ArrayMutationOperations<T> {
  // Safe array operations that return new arrays
  push: (array: T[], ...items: T[]) => T[];
  pop: (array: T[]) => { newArray: T[]; poppedItem?: T };
  shift: (array: T[]) => { newArray: T[]; shiftedItem?: T };
  unshift: (array: T[], ...items: T[]) => T[];
  splice: (array: T[], start: number, deleteCount?: number, ...items: T[]) => T[];
  removeByIndex: (array: T[], index: number) => T[];
  removeByPredicate: (array: T[], predicate: (item: T) => boolean) => T[];
  updateByIndex: (array: T[], index: number, newItem: T) => T[];
  updateByPredicate: (array: T[], predicate: (item: T) => boolean, updateFn: (item: T) => T) => T[];
  moveItem: (array: T[], fromIndex: number, toIndex: number) => T[];
  insertAt: (array: T[], index: number, ...items: T[]) => T[];
  deduplicate: (array: T[], keyFn?: (item: T) => string | number) => T[];
}

export const useArrayMutationFix = <T>(): ArrayMutationOperations<T> => {
  
  const push = useCallback((array: T[], ...items: T[]): T[] => {
    logger.debug('Array mutation fix: push operation');
    return [...array, ...items];
  }, []);

  const pop = useCallback((array: T[]): { newArray: T[]; poppedItem?: T } => {
    logger.debug('Array mutation fix: pop operation');
    if (array.length === 0) {
      return { newArray: array };
    }
    const newArray = array.slice(0, -1);
    const poppedItem = array[array.length - 1];
    return { newArray, poppedItem };
  }, []);

  const shift = useCallback((array: T[]): { newArray: T[]; shiftedItem?: T } => {
    logger.debug('Array mutation fix: shift operation');
    if (array.length === 0) {
      return { newArray: array };
    }
    const newArray = array.slice(1);
    const shiftedItem = array[0];
    return { newArray, shiftedItem };
  }, []);

  const unshift = useCallback((array: T[], ...items: T[]): T[] => {
    logger.debug('Array mutation fix: unshift operation');
    return [...items, ...array];
  }, []);

  const splice = useCallback((array: T[], start: number, deleteCount = 0, ...items: T[]): T[] => {
    logger.debug('Array mutation fix: splice operation');
    const newArray = [...array];
    newArray.splice(start, deleteCount, ...items);
    return newArray;
  }, []);

  const removeByIndex = useCallback((array: T[], index: number): T[] => {
    logger.debug('Array mutation fix: removeByIndex operation');
    if (index < 0 || index >= array.length) {
      logger.warn('Array mutation fix: removeByIndex out of bounds');
      return array;
    }
    return array.filter((_, i) => i !== index);
  }, []);

  const removeByPredicate = useCallback((array: T[], predicate: (item: T) => boolean): T[] => {
    logger.debug('Array mutation fix: removeByPredicate operation');
    return array.filter((item) => !predicate(item));
  }, []);

  const updateByIndex = useCallback((array: T[], index: number, newItem: T): T[] => {
    logger.debug('Array mutation fix: updateByIndex operation');
    if (index < 0 || index >= array.length) {
      logger.warn('Array mutation fix: updateByIndex out of bounds');
      return array;
    }
    return array.map((item, i) => (i === index ? newItem : item));
  }, []);

  const updateByPredicate = useCallback((array: T[], predicate: (item: T) => boolean, updateFn: (item: T) => T): T[] => {
    logger.debug('Array mutation fix: updateByPredicate operation');
    return array.map((item) => (predicate(item) ? updateFn(item) : item));
  }, []);

  const moveItem = useCallback((array: T[], fromIndex: number, toIndex: number): T[] => {
    logger.debug('Array mutation fix: moveItem operation');
    if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
      logger.warn('Array mutation fix: moveItem out of bounds');
      return array;
    }
    
    const newArray = [...array];
    const [movedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, movedItem);
    return newArray;
  }, []);

  const insertAt = useCallback((array: T[], index: number, ...items: T[]): T[] => {
    logger.debug('Array mutation fix: insertAt operation');
    if (index < 0 || index > array.length) {
      logger.warn('Array mutation fix: insertAt out of bounds');
      return array;
    }
    return [
      ...array.slice(0, index),
      ...items,
      ...array.slice(index)
    ];
  }, []);

  const deduplicate = useCallback((array: T[], keyFn?: (item: T) => string | number): T[] => {
    logger.debug('Array mutation fix: deduplicate operation');
    
    if (!keyFn) {
      return Array.from(new Set(array));
    }
    
    const seen = new Set<string | number>();
    return array.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, []);

  return {
    push,
    pop,
    shift,
    unshift,
    splice,
    removeByIndex,
    removeByPredicate,
    updateByIndex,
    updateByPredicate,
    moveItem,
    insertAt,
    deduplicate
  };
};

export default useArrayMutationFix;