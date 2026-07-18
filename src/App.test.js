import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the FixKar brand in the navbar", () => {
  render(<App />);
  const brand = screen.getByText(/Kar/i);
  expect(brand).toBeInTheDocument();
});
