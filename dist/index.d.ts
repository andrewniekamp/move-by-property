/** Simple movement of an element within a list
 *
 *  The element at the original index is moved to the destination index
 *
 *  All other elements are adjusted, accordingly
 *
 *  Example: elementMoved([A, B, C, D, E], 0, 3) => [B, C, D, A, E]
 *
 *  MUTATES the original array
 */
export declare const moveElement: (elemList: any[], originIndex: number, destinationIndex: number) => void;
/** Simple movement of an element within a list
 *
 *  The element at the original index is moved to the destination index
 *
 *  All other elements are adjusted, accordingly
 *
 *  Example: elementMoved([A, B, C, D, E], 0, 3) => [B, C, D, A, E]
 *
 *  DOES NOT MUTATE the original array
 */
export declare const moveElementImmutable: (elemList: any[], originIndex: number, destinationIndex: number) => any[];
/** Assumes primitive page numbers are stored in list[elem].indexKey[0].indexKey[1]... etc.
 *
 *  Assumes page numbers are 0-indexed unless optional flag is passed in
 *
 *  Sorting is not an option
 *
 *  MUTATES the original array
 */
export declare const moveElementByProperty: (elemList: any[], originIndex: number, destinationIndex: number, indexKey: string | number | (string | number)[], zeroIndexed?: boolean) => void;
/** Assumes primitive page numbers are stored in list[elem].indexKey[0].indexKey[1]... etc.
 *
 *  Assumes page numbers are 0-indexed unless optional flag is passed in
 *
 *  Can optionally sort the returned array so that elements are ordered by the indexKey values
 *
 *  DOES NOT MUTATE the original array
 */
export declare const moveElementByPropertyImmutable: (elemList: any[], originIndex: number, destinationIndex: number, indexKey: string | number | (string | number)[], zeroIndexed?: boolean, sort?: boolean) => any[];
