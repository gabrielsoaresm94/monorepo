import React from "react";
import { render } from "@testing-library/react";
// import { renderHook, act } from '@testing-library/react-hooks';
import Home from "./";

// describe("Home component", () => {
//   it("should be able render a home", () => {
//     const role = "main";

//     const { getByRole } = render(<Home />);

//     expect(getByRole(role)).toBeTruthy();
//   });
// });

test("adds 1 + 2 to equal 3", () => {
  const sum = (a: number, b: number): number => {
    return a + b;
  };

  expect(sum(1, 2)).toBe(3);
});
