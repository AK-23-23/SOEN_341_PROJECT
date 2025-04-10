// src/__tests__/Dashboard.test.jsx
import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard"; // Correct path
import { BrowserRouter } from "react-router-dom";
import { auth, db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

// Use vi for mocking
import { vi } from 'vitest';

vi.mock("../Firebase", () => ({
  auth: {
    currentUser: { uid: "user123", email: "admin@conu.ca" },
    onAuthStateChanged: vi.fn((callback) => {
      callback({ uid: "user123" });
      return { unsubscribe: vi.fn() }; // Provide unsubscribe method
    }),
  },
  db: {
    collection: vi.fn(),
  },
}));

describe("Dashboard Component", () => {
  test("renders dashboard", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText("Groups")).toBeInTheDocument(); // Check for a static element
    expect(screen.getByText("Users")).toBeInTheDocument(); // Check for a static element
  });
});