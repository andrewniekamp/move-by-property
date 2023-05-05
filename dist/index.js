"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateListByPropImmutable = exports.updateListByProp = exports.moveElement = void 0;
const lodash_clonedeep_1 = __importDefault(require("lodash.clonedeep"));
/** Simple movement of an element within a list
 *
 *  The element at the original index is moved to the destination index
 *
 *  All other elements are adjusted, accordingly
 *
 *  Example: elementMoved([A, B, C, D, E], 0, 3) => [B, C, D, A, E]
 *
 *  Does not mutate the original array
 */
const moveElement = (
/** The list of elements holding the element to be moved */
elemList, 
/** The index of the element to be moved */
originIndex, 
/** The destination index of the element to be moved */
destinationIndex) => {
    const clonedList = (0, lodash_clonedeep_1.default)(elemList);
    const originalElement = clonedList[originIndex];
    clonedList.splice(originIndex, 1);
    clonedList.splice(destinationIndex, 0, originalElement);
    return clonedList;
};
exports.moveElement = moveElement;
/** Assumes primitive page numbers are stored in list[elem].indexKey[0].indexKey[1]... etc.
 *
 *  Assumes page numbers are 0-indexed unless optional flag is passed in
 *
 *  Sorting is not an option
 *
 *  MUTATES the original array
 */
const updateListByProp = (
/** The list of elements holding the element to be moved */
elemList, 
/** The index of the element to be moved */
originIndex, 
/** The destination index of the element to be moved */
destinationIndex, 
/** A reference or references to the properties/keys needed to access the position value */
indexKey, 
/** Optional, defaults to true. An indication as to whether the index is 0-indexed or 1-indexed */
zeroIndexed = true) => {
    moveElementByProp(elemList, originIndex, destinationIndex, indexKey, zeroIndexed);
};
exports.updateListByProp = updateListByProp;
/** Assumes primitive page numbers are stored in list[elem].indexKey[0].indexKey[1]... etc.
 *
 *  Assumes page numbers are 0-indexed unless optional flag is passed in
 *
 *  Can optionally sort the returned array so that elements are ordered by the indexKey values
 *
 *  DOES NOT MUTATE the original array
 */
const updateListByPropImmutable = (
/** The list of elements holding the element to be moved */
elemList, 
/** The index of the element to be moved */
originIndex, 
/** The destination index of the element to be moved */
destinationIndex, 
/** A reference or references to the properties/keys needed to access the position value */
indexKey, 
/** Optional, defaults to true. An indication as to whether the index is 0-indexed or 1-indexed */
zeroIndexed = true, 
/** Optional, defaults to false. A flag that will sort the results based on the ultimate position values */
sort = false) => {
    const clonedList = (0, lodash_clonedeep_1.default)(elemList);
    moveElementByProp(clonedList, originIndex, destinationIndex, indexKey, zeroIndexed, sort);
    return clonedList;
};
exports.updateListByPropImmutable = updateListByPropImmutable;
/** Assumes primitive page numbers are stored in list[elem].indexKey[0].indexKey[1]... etc.
 *
 *  Assumes page numbers are 0-indexed unless optional flag is passed in
 *
 *  Does not mutate the original array
 */
const moveElementByProp = (
/** The list of elements holding the element to be moved */
elemList, 
/** The index of the element to be moved */
originIndex, 
/** The destination index of the element to be moved */
destinationIndex, 
/** A reference or references to the properties/keys needed to access the position value */
indexKey, 
/** Optional, defaults to true. An indication as to whether the index is 0-indexed or 1-indexed */
zeroIndexed = true, 
/** Optional, defaults to false. A flag that will sort the results based on the ultimate position values */
sort = false) => {
    const sortedList = [];
    const indexList = standardizeIndexList(indexKey);
    const { originPageNo, destinationPageNo } = resolveIndexType(originIndex, destinationIndex, zeroIndexed);
    const movedUp = originPageNo < destinationPageNo;
    const movedDown = originPageNo > destinationPageNo;
    elemList.forEach((elem) => {
        /** The original pageNumber of the element being moved */
        let pageNo;
        /** Starts as the initial element, but is reassigned during each loop to the next property value */
        let depthReference = elem;
        /** The deepest key/property being accessed to identify a page number */
        let deepestKey = indexList[indexList.length - 1];
        indexList.forEach((key) => {
            if (key === deepestKey) {
                depthReference[key] = { pageNo: depthReference[key] };
                pageNo = depthReference[key];
            }
            else {
                depthReference = depthReference[key];
            }
        });
        pageNo = depthReference[deepestKey].pageNo;
        if (pageNo === originPageNo) {
            // The origin element moves to destination
            depthReference[deepestKey] = destinationPageNo;
            sort && positionElement(sortedList, elem, destinationPageNo, zeroIndexed);
        }
        else {
            // Other elements that may need to be adjusted
            if (movedUp && pageNo > originPageNo && pageNo <= destinationPageNo) {
                // This element moves down in the list
                depthReference[deepestKey] = pageNo - 1;
                sort && positionElement(sortedList, elem, pageNo - 1, zeroIndexed);
            }
            else if (movedDown &&
                pageNo < originPageNo &&
                pageNo >= destinationPageNo) {
                // This element moves up in the list
                depthReference[deepestKey] = pageNo + 1;
                sort && positionElement(sortedList, elem, pageNo + 1, zeroIndexed);
            }
            else {
                // This element doesn't move
                depthReference[deepestKey] = pageNo;
                sort && positionElement(sortedList, elem, pageNo, zeroIndexed);
            }
        }
    });
    return sort ? sortedList : elemList;
};
/** Determines the page numbers based on the index type (0-indexed or 1-indexed) */
const resolveIndexType = (originIndex, destinationIndex, zeroIndexed) => {
    let originPageNo = originIndex;
    let destinationPageNo = destinationIndex;
    if (!zeroIndexed) {
        originPageNo = originIndex + 1;
        destinationPageNo = destinationIndex + 1;
    }
    return {
        originPageNo,
        destinationPageNo,
    };
};
/** Changes the indexList into an array format, if it is not already an array */
const standardizeIndexList = (indexKey) => {
    let indexList;
    if (!Array.isArray(indexKey)) {
        indexList = [indexKey];
    }
    else {
        indexList = indexKey;
    }
    return indexList;
};
/** Places the element into the given array index */
const positionElement = (sortedList, elem, pageNo, zeroIndexed) => {
    if (!zeroIndexed) {
        sortedList[pageNo - 1] = elem;
    }
    else {
        sortedList[pageNo] = elem;
    }
};
//# sourceMappingURL=index.js.map