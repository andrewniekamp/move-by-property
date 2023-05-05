# Move by Property

A lightweight package (with minimal dependencies) for moving an element within an array, including movement based on a key/property (even deeply nested). moveElementByProperty() and moveElementByPropertyImmutable() achieve property-based movement by updating the origin element and all other elements in the list to maintain the desired order. Note: this is not swapping elements. It involves moving one element from an origin position to a destination position and adjusting the other elements above/below that point of destination accordingly. For a simpler operation, moveElement() can carry out direct movement and uses Array.splice().  See below for examples.

The term "property-based movement" refers to the concept of relying on a specific property within your objects to determine the order, rather than the actual positions of the elements in the array.

For instance, imagine you are working with an array of data where the meaningful order is not determined by the actual array order, but instead depends on a property value of the data returned (e.g., [{ position: 2, data: { ... } }, { position: 1, data: { ... } }]). If you need to "move" an element within that data, you may need to adjust the properties while keeping the other elements' corresponding properties updated. If so, this package may be helpful.

## Installation

Using npm or yarn:

```
npm install move-by-property
```
```
yarn add move-by-property
```

## Usage

Calling `moveElement()` will simply move the element using `Array.splice()` and the array is adjusted accordingly.

```typescript
import { moveElement } from "move-by-property";

const list = ["A", "B", "C", "D"];
moveElement(list, 0, 2);
console.log(list); // ["B", "C", "A", "D"] <- "A" is moved to index 2
```

Calling `moveElementImmutable()` will still replace the element using `splice()`, but does not mutate the data and immediately creates a deep copy (using \_.cloneDeep).

```typescript
import { moveElementImmutable } from "move-by-property";

const list = ["A", "B", "C", "D"];
const newList = moveElementImmutable(list, 0, 2);
console.log(list); // ["A", "B", "C", "D"] <- stays the same
console.log(newList); // ["B", "C", "A", "D"] <- "A" is moved to index 2
```

Calling `moveElementVirtual()` allows you to adjust the elements based on a property (including nested properties). It assumes a 0-indexed values for the order numbers, but you can pass in an optional flag to use 1-indexed values. Mutates the original array and cannot be sorted (...just yet).

```javascript
import { moveElementVirtual } from "move-by-property";

const list = [
  {
    data: { position: 0 },
    otherData:
      "Originally position 0, but will change the position property to 2",
  },
  {
    data: { position: 1 },
    otherData:
      "Originally position 1, but will change the position property to 0 when position 0 changes the position property to 2",
  },
  {
    data: { position: 2 },
    otherData:
      "Originally position 2, but will change the position property to 1 when position 0 changes the position property to 2",
  },
];

const nestedPropertyPath = ["data", "position"];
const isZeroIndexed = true;
moveElementVirtual(list, 0, 2, nestedPropertyPath, isZeroIndexed);
console.log(list)
/**
  {
    data: { position: 2 },
    otherData:
      "Originally position 0, but will change the position property to 2",
  },
  {
    data: { position: 0 },
    otherData:
      "Originally position 1, but will change the position property to 0 when position 0 changes the position property to 2",
  },
  {
    data: { position: 1 },
    otherData:
      "Originally position 2, but will change the position property to 1 when position 0 changes the position property to 2",
  },
 * /
```

Calling `moveElementVirtualImmutable()` is similar, but it does not mutate the data and immediately creates a deep copy (using \_.cloneDeep). You can optionally pass in a boolean flag to sort the array, if desired.

```javascript
import { moveElementVirtualImmutable } from "move-by-property";

const list = [
  {
    data: { position: 0 },
    otherData:
      "Originally position 0, but will change the position property to 2",
  },
  {
    data: { position: 1 },
    otherData:
      "Originally position 1, but will change the position property to 0 when position 0 changes the position property to 2",
  },
  {
    data: { position: 2 },
    otherData:
      "Originally position 2, but will change the position property to 1 when position 0 changes the position property to 2",
  },
];

const nestedPropertyPath = ["data", "position"];
const isZeroIndexed = true;
const shouldSort = true;
const result = moveElementVirtualImmutable(list, 0, 2, nestedPropertyPath, isZeroIndexed, shouldSort);
/**
  {
    data: { position: 0 },
    otherData:
      "Originally position 1, but will change the position property to 0 when position 0 changes the position property to 2",
  },
  {
    data: { position: 1 },
    otherData:
      "Originally position 2, but will change the position property to 1 when position 0 changes the position property to 2",
  },
  {
    data: { position: 2 },
    otherData:
      "Originally position 0, but will change the position property to 2",
  },
 * /
```

## Additional Details

### Method: `moveElement()`

- Input:
  ```typescript
  /** The list of elements holding the element to be moved */
  elemList: any[],
  /** The index of the element to be moved */
  originIndex: number,
  /** The destination index of the element to be moved */
  destinationIndex: number
  ```
- Output: N/A - It mutates the original array and nothing is returned.

### Method: `moveElementImmutable()`

- Inputs: Same as `moveElement()`
- Output: It returns a modified deep clone of the original array and the original array remains intact.

### Method: `moveElementVirtual()`

- Input:
  ```typescript
  /** The list of elements holding the element to be moved */
  elemList: any[],
  /** The index of the element to be moved */
  originIndex: number,
  /** The destination index of the element to be moved */
  destinationIndex: number,
  /** A reference or references to the properties/keys needed to access the position value */
  indexKey: string | number | (string | number)[],
  /** Optional, defaults to true. An indication as to whether the index is 0-indexed or 1-indexed */
  zeroIndexed: boolean = true
  ```
- Output: N/A - It mutates the original array and nothing is returned.

### Method: `moveElementVirtualImmutable()`

- Inputs:
  ```typescript
  /** The list of elements holding the element to be moved */
  elemList: any[],
  /** The index of the element to be moved */
  originIndex: number,
  /** The destination index of the element to be moved */
  destinationIndex: number,
  /** A reference or references to the properties/keys needed to access the position value */
  indexKey: string | number | (string | number)[],
  /** Optional, defaults to true. An indication as to whether the index is 0-indexed or 1-indexed */
  zeroIndexed: boolean = true,
  /** Optional, defaults to false. A flag that will sort the results based on the ultimate position values */
  sort: boolean = false
  ```
- Output: It returns a modified deep clone of the original array and the original array remains intact.
