// src/__tests__/Chat.test.jsx
import { render, screen } from "@testing-library/react";
import Chat from "../Chat"; // Correct path
import { auth, db } from "../Firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";

// Use vi for mocking
import { vi } from 'vitest';

vi.mock("../Firebase", () => ({
  auth: {
    currentUser: {
      uid: "rXypIaFws7WlU00q5M4rVclurH2",
      email: "admin@conu.ca",
      userType: "Admin",
      username: "Admin",
    },
  },
  db: {
    // Simplified mock to avoid Firestore errors
    collection: vi.fn(),
  },
}));

vi.mock("firebase/firestore", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule, // Preserve all original exports
    collection: vi.fn(),
    addDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

describe("Chat Component", () => {
  test("renders chat input", () => {
    render(<Chat userId="someUserId" groupId={null} />);
    expect(screen.getByPlaceholderText(/Message @/i)).toBeInTheDocument();
  });
});