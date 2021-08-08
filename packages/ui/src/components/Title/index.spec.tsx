import React from "react";
import { render } from "@testing-library/react";
import { Title } from "./index";


describe("Title component", () => {
  it("should be able render a title with a text", () => {
    const text = 'Novo título';

    const { getByText } = render(
      <Title>{text}</Title>
    );

    expect(getByText(text)).toBeTruthy();
  });
});
