/**
 * Safe array operation utilities that maintain backward compatibility
 * while providing immutable alternatives for React state management
 */

/**
 * Safe array push - maintains existing mutation but also returns new array
 */
export const safeArrayPush = <T>(array: T[], ...items: T[]): T[] => {
  // For backward compatibility, still mutate the original array
  array.push(...items);
  // Return new array for modern usage
  return [...array];
};

/**
 * Safe array splice - maintains existing mutation but also returns new array
 */
export const safeArraySplice = <T>(
  array: T[], 
  start: number, 
  deleteCount?: number, 
  ...items: T[]
): T[] => {
  // For backward compatibility, still mutate the original array
  array.splice(start, deleteCount || 0, ...items);
  // Return new array for modern usage
  return [...array];
};

/**
 * Safe array unshift - maintains existing mutation but also returns new array
 */
export const safeArrayUnshift = <T>(array: T[], ...items: T[]): T[] => {
  // For backward compatibility, still mutate the original array
  array.unshift(...items);
  // Return new array for modern usage
  return [...array];
};

/**
 * Pure immutable operations (recommended for new code)
 */
export const immutableArrayOperations = {
  push: <T>(array: T[], ...items: T[]): T[] => [...array, ...items],
  splice: <T>(array: T[], start: number, deleteCount = 0, ...items: T[]): T[] => {
    const result = [...array];
    result.splice(start, deleteCount, ...items);
    return result;
  },
  unshift: <T>(array: T[], ...items: T[]): T[] => [...items, ...array],
  remove: <T>(array: T[], index: number): T[] => array.filter((_, i) => i !== index),
  update: <T>(array: T[], index: number, item: T): T[] => 
    array.map((existing, i) => i === index ? item : existing)
};

/**
 * Migration helper to gradually replace direct mutations
 */
export const createSafeArrayMutator = <T>() => {
  return {
    /**
     * Use this in setState calls to ensure React recognizes state changes
     */
    mutateAndReturn: (array: T[], operation: (arr: T[]) => void): T[] => {
      operation(array);
      return [...array];
    }
  };
};

export default {
  safeArrayPush,
  safeArraySplice,
  safeArrayUnshift,
  immutableArrayOperations,
  createSafeArrayMutator
};