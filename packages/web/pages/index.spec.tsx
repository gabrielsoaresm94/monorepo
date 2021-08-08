import React from "react";
import { render } from "@testing-library/react";
import Home from "./";

describe("Home component", () => {
  it("should be able render a home", () => {
    const text = "Interface monorepo";

    const { getByText } = render(<Home />);

    expect(getByText(text)).toBeTruthy();
  });
});
