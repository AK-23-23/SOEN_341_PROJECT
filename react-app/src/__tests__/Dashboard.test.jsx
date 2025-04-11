import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../Dashboard"; // Adjust path as necessary
import { BrowserRouter } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

jest.mock("../firebase", () => ({
  auth: { currentUser: { uid: "user123", email: "test@example.com" } },
  db: { collection: jest.fn(), getDocs: jest.fn() },
}));

const mockUsers = [
  { id: "user1", username: "Alice" },
  { id: "user2", username: "Bob" },
];

const mockGroups = [
  { id: "group1", name: "General" },
  { id: "group2", name: "Project Help" },
];

db.collection.mockImplementation((colName) => {
  if (colName === "users") return { getDocs: jest.fn(() => ({ docs: mockUsers })) };
  if (colName === "groups") return { getDocs: jest.fn(() => ({ docs: mockGroups })) };
});

describe("Dashboard Component", () => {
  test("renders users and groups", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(await screen.findByText("Bob")).toBeInTheDocument();
    expect(await screen.findByText("General")).toBeInTheDocument();
  });

  test("navigates to direct messages on user click", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const userAlice = await screen.findByText("Alice");
    fireEvent.click(userAlice);
    
    expect(window.location.pathname).toBe("/chat/user1");
  });

  test("navigates to group chat on group click", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const groupGeneral = await screen.findByText("General");
    fireEvent.click(groupGeneral);
    
    expect(window.location.pathname).toBe("/chat/group1");
  });

  test("only admins can delete groups", async () => {
    auth.currentUser = { uid: "admin123", userType: "Admin" };
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    const deleteButton = await screen.findByTestId("delete-group-group1");
    expect(deleteButton).toBeInTheDocument();
  });
});
