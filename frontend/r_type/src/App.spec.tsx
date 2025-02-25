import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Renders App", () => {
	beforeEach(() => {
		render(<App />);

	})
	it("Renders App", () => {
	});
	it("renders sandbox text", () => {
		expect(screen.getByText("This is a Sandbox Repo")).toBeInTheDocument();
	});
});
