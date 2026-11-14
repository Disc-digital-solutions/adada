import { describe, expect, it } from "vitest";
import { courseCodesIn, normalizeCourse } from "./course";

describe("normalizeCourse", () => {
  it("writes every spelling the same way", () => {
    for (const s of ["MATH101", "math101", "Math 101", "math-101", " MATH 101 "]) expect(normalizeCourse(s)).toBe("MATH101");
  });
  it("returns nothing for text that is not a course code", () => {
    expect(normalizeCourse("calculus")).toBe("");
    expect(normalizeCourse("MATH1011")).toBe("");
  });
});

describe("courseCodesIn", () => {
  it("finds every course in a description, once", () => {
    expect(courseCodesIn("Notes for MATH 101 and phys-102, also good for math101")).toEqual(["MATH101", "PHYS102"]);
  });
  it("ignores prices and sizes", () => {
    expect(courseCodesIn("iPhone 128 GB, 500 TL, TL 500")).toEqual([]);
  });
});
