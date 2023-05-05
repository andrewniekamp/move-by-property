import cloneDeep from "lodash.clonedeep";
import {
  moveElement,
  moveElementImmutable,
  moveElementVirtual,
  moveElementVirtualImmutable,
} from "../src/index";

interface TestObject {
  data: { page: number | string };
  otherData: { testVal: string };
}
const item0: TestObject = {
  data: { page: 0 },
  otherData: { testVal: "Originally page 0" },
};
const item1: TestObject = {
  data: { page: 1 },
  otherData: { testVal: "Originally page 1" },
};
const item2: TestObject = {
  data: { page: 2 },
  otherData: { testVal: "Originally page 2" },
};
const item3: TestObject = {
  data: { page: 3 },
  otherData: { testVal: "Originally page 3" },
};
const item4: TestObject = {
  data: { page: 4 },
  otherData: { testVal: "Originally page 4" },
};
const item5: TestObject = {
  data: { page: 5 },
  otherData: { testVal: "Originally page 5" },
};

let tempItem0: TestObject;
let tempItem1: TestObject;
let tempItem2: TestObject;
let tempItem3: TestObject;
let tempItem4: TestObject;
let tempItem5: TestObject;

beforeEach(() => {
  tempItem0 = cloneDeep(item0);
  tempItem1 = cloneDeep(item1);
  tempItem2 = cloneDeep(item2);
  tempItem3 = cloneDeep(item3);
  tempItem4 = cloneDeep(item4);
  tempItem5 = cloneDeep(item5);
});
describe("moveElement", () => {
  test("expected list to be mutated", () => {
    const list = ["A", "B", "C", "D", "E"];
    const copyBeforeChanging = cloneDeep(list);
    moveElement(list, 0, 3);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
  test("expected function to replace a primitive element based on index", () => {
    const list = ["A", "B", "C", "D", "E"];
    const copyBeforeChanging = cloneDeep(list);
    const strictEqualResult = ["B", "C", "D", "A", "E"];
    moveElement(list, 0, 3);
    expect(list).toStrictEqual(strictEqualResult);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
  test("expected function to replace an object element based on index", () => {
    const list = [tempItem1, tempItem2, tempItem3];
    const copyBeforeChanging = cloneDeep(list);
    const strictEqualResult = [tempItem2, tempItem1, tempItem3];
    moveElement(list, 0, 1);
    expect(list).toStrictEqual(strictEqualResult);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
});
describe("moveElementImmutable", () => {
  test("expected list to not be mutated", () => {
    const list = ["A", "B", "C", "D", "E"];
    const cloned = cloneDeep(list);
    const result = moveElementImmutable(list, 0, 3);
    expect(list).toStrictEqual(cloned);
    expect(list).not.toEqual(result);
  });
  test("expected function to replace a primitive element based on index", () => {
    const list = ["A", "B", "C", "D", "E"];
    const result = moveElementImmutable(list, 0, 3);
    expect(result).toStrictEqual(["B", "C", "D", "A", "E"]);
  });
  test("expected function to replace an object element based on index", () => {
    const list = [tempItem1, tempItem2, tempItem3];
    const result = moveElementImmutable(list, 0, 1);
    expect(result).toStrictEqual([tempItem2, tempItem1, tempItem3]);
  });
});
describe("moveElementVirtualImmutable", () => {
  test("expected list to not be mutated", () => {
    const list = [tempItem1, tempItem2];
    const copyBeforeChanging = cloneDeep(list);
    const result = moveElementVirtualImmutable(list, 0, 1, ["data", "page"]);
    expect(list).toStrictEqual(copyBeforeChanging);
    expect(list).not.toEqual(result);
  });
  test("expected function to replace an element based on indexKey in an unordered list AND sort", () => {
    const list = [tempItem4, tempItem2, tempItem1, tempItem3, tempItem5];
    const copyBeforeChanging = cloneDeep(list);
    const newList = [
      { tempItem2, data: { page: 1 } },
      { tempItem3, data: { page: 2 } },
      { tempItem4, data: { page: 3 } },
      { tempItem5, data: { page: 4 } },
      { tempItem1, data: { page: 5 } },
    ];
    const result = moveElementVirtualImmutable(
      newList,
      0,
      4,
      ["data", "page"],
      false,
      true
    );
    expect(list).toStrictEqual(copyBeforeChanging);
    expect(list).not.toStrictEqual(result);
  });
  test("expected function to simply sort based on the property if no movement occurs (1-indexed)", () => {
    const list = [tempItem4, tempItem2, tempItem1, tempItem3, tempItem5];
    const copyBeforeChanging = cloneDeep(list);
    const newList = [tempItem1, tempItem2, tempItem3, tempItem4, tempItem5];
    const result = moveElementVirtualImmutable(
      newList,
      0,
      0,
      ["data", "page"],
      false,
      true
    );
    expect(list).toStrictEqual(copyBeforeChanging);
    expect(list).not.toStrictEqual(result);
  });
  test("expected function to simply sort based on the property if no movemen occurs (0-indexed)", () => {
    const list = [tempItem4, tempItem2, tempItem1, tempItem3, tempItem0];
    const copyBeforeChanging = cloneDeep(list);
    const newList = [tempItem0, tempItem1, tempItem2, tempItem3, tempItem4];
    const result = moveElementVirtualImmutable(
      newList,
      0,
      0,
      ["data", "page"],
      true,
      true
    );
    expect(list).toStrictEqual(copyBeforeChanging);
    expect(list).not.toStrictEqual(result);
  });
});
describe("moveElementVirtual", () => {
  test("expected function to replace an element based on indexKey in a two-element list", () => {
    const list = [tempItem1, tempItem2];
    const copyBeforeChanging = cloneDeep(list);
    const strictEqualResult = [
      { ...cloneDeep(tempItem1), data: { page: 2 } },
      { ...cloneDeep(tempItem2), data: { page: 1 } },
    ];
    moveElementVirtual(list, 0, 1, ["data", "page"], false);
    expect(list).toStrictEqual(strictEqualResult);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
  test("expected function to replace an element based on zero-indexed list", () => {
    const list = [tempItem0, tempItem1];
    const copyBeforeChanging = cloneDeep(list);
    const strictEqualResult = [
      { ...cloneDeep(tempItem0), data: { page: 1 } },
      { ...cloneDeep(tempItem1), data: { page: 0 } },
    ];
    moveElementVirtual(list, 0, 1, ["data", "page"], true);
    expect(list).toStrictEqual(strictEqualResult);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
  test("expected function to replace an element based on indexKey in any size list", () => {
    const list = [tempItem1, tempItem2, tempItem3, tempItem4, tempItem5];
    const copyBeforeChanging = cloneDeep(list);
    const strictEqualResult = [
      { ...cloneDeep(tempItem1), data: { page: 3 } },
      { ...cloneDeep(tempItem2), data: { page: 1 } },
      { ...cloneDeep(tempItem3), data: { page: 2 } },
      { ...cloneDeep(tempItem4), data: { page: 4 } },
      { ...cloneDeep(tempItem5), data: { page: 5 } },
    ];
    moveElementVirtual(list, 0, 2, ["data", "page"], false);
    expect(list).toStrictEqual(strictEqualResult);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
  test("expected function to replace an element based on indexKey in an unordered list", () => {
    const list = [tempItem4, tempItem2, tempItem1, tempItem3, tempItem5];
    const copyBeforeChanging = cloneDeep(list);
    const strictEqualResult = [
      { ...cloneDeep(tempItem4), data: { page: 3 } },
      { ...cloneDeep(tempItem2), data: { page: 1 } },
      { ...cloneDeep(tempItem1), data: { page: 5 } },
      { ...cloneDeep(tempItem3), data: { page: 2 } },
      { ...cloneDeep(tempItem5), data: { page: 4 } },
    ];
    moveElementVirtual(list, 0, 4, ["data", "page"], false);
    expect(list).toStrictEqual(strictEqualResult);
    expect(list).not.toStrictEqual(copyBeforeChanging);
  });
  describe("README examples", () => {
    test("moveElementByProp example1", () => {
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
      moveElementVirtual(list, 0, 2, ["data", "position"], true);
      expect(list).toStrictEqual([
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
      ]);
    });
    test("moveElementByProp example2", () => {
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
      const result = moveElementVirtualImmutable(
        list,
        0,
        2,
        ["data", "position"],
        true,
        true
      );
      expect(result).toStrictEqual([
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
      ]);
    });
  });
});
