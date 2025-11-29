import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { Name } from "../../../src/adap-b04/names/Name";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
// Preconditions: index checks for getComponent, setComponent,
// insert, remove

describe("Name contracts – preconditions (index bounds)", () => {

  it("StringName: getComponent index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringName("one.two.three", ".");

    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(3)).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: getComponent index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringArrayName(["one", "two", "three"], ".");

    expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
    expect(() => n.getComponent(3)).toThrow(IllegalArgumentException);
  });

  it("StringName: setComponent index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringName("one.two", ".");
    expect(() => n.setComponent(-1, "x")).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(2, "x")).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: setComponent index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringArrayName(["one", "two"], ".");
    expect(() => n.setComponent(-1, "x")).toThrow(IllegalArgumentException);
    expect(() => n.setComponent(2, "x")).toThrow(IllegalArgumentException);
  });

  it("StringName: insert index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringName("one.two", ".");
    expect(() => n.insert(-1, "x")).toThrow(IllegalArgumentException);
    expect(() => n.insert(3, "x")).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: insert index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringArrayName(["one", "two"], ".");
    expect(() => n.insert(-1, "x")).toThrow(IllegalArgumentException);
    expect(() => n.insert(3, "x")).toThrow(IllegalArgumentException);
  });

  it("StringName: remove index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringName("one.two", ".");
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(2)).toThrow(IllegalArgumentException);
  });

  it("StringArrayName: remove index out of range should throw IllegalArgumentException", () => {
    const n: Name = new StringArrayName(["one", "two"], ".");
    expect(() => n.remove(-1)).toThrow(IllegalArgumentException);
    expect(() => n.remove(2)).toThrow(IllegalArgumentException);
  });
});

// Postconditions: append / insert / remove behavior
describe("Name contracts – postconditions for modification methods", () => {

  it("StringName: append increases size and adds component at the end", () => {
    const n: Name = new StringName("one.two", ".");
    const oldNo = n.getNoComponents();

    n.append("three");

    expect(n.getNoComponents()).toBe(oldNo + 1);
    expect(n.getComponent(n.getNoComponents() - 1)).toBe("three");
  });

  it("StringArrayName: append increases size and adds component at the end", () => {
    const n: Name = new StringArrayName(["one", "two"], ".");
    const oldNo = n.getNoComponents();

    n.append("three");

    expect(n.getNoComponents()).toBe(oldNo + 1);
    expect(n.getComponent(n.getNoComponents() - 1)).toBe("three");
  });

  it("StringName: insert inserts at correct position and shifts others", () => {
    const n: Name = new StringName("one.three", ".");
    n.insert(1, "two");

    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("one");
    expect(n.getComponent(1)).toBe("two");
    expect(n.getComponent(2)).toBe("three");
  });

  it("StringArrayName: insert inserts at correct position and shifts others", () => {
    const n: Name = new StringArrayName(["one", "three"], ".");
    n.insert(1, "two");

    expect(n.getNoComponents()).toBe(3);
    expect(n.getComponent(0)).toBe("one");
    expect(n.getComponent(1)).toBe("two");
    expect(n.getComponent(2)).toBe("three");
  });

  it("StringName: remove removes component and reduces size", () => {
    const n: Name = new StringName("one.two.three", ".");
    n.remove(1);

    expect(n.getNoComponents()).toBe(2);
    expect(n.getComponent(0)).toBe("one");
    expect(n.getComponent(1)).toBe("three");
  });

  it("StringArrayName: remove removes component and reduces size", () => {
    const n: Name = new StringArrayName(["one", "two", "three"], ".");
    n.remove(1);

    expect(n.getNoComponents()).toBe(2);
    expect(n.getComponent(0)).toBe("one");
    expect(n.getComponent(1)).toBe("three");
  });
});
/** clone / equality contract */
describe("Name contracts – clone and equality", () => {

  it("clone should create equal but distinct instance (StringArrayName)", () => {
    const original: Name = new StringArrayName(["oss", "cs", "fau", "de"], ".");
    const clone: Name = original.clone();

    expect(clone).not.toBe(original);          // different objects
   expect(clone.isEqual(original)).toBe(true); // but equal by contract
  });

  it("clone should create equal but distinct instance (StringName)", () => {
    const original: Name = new StringName("oss.cs.fau.de", ".");
    const clone: Name = original.clone();

    expect(clone).not.toBe(original);
    expect(clone.isEqual(original)).toBe(true);
  });
});
