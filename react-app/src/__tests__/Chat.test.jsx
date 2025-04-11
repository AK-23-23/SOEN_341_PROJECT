import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "../components/Chat";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import { jest } from "@jest/globals";

jest.mock("../firebase", () => ({
  auth: { currentUser: { uid: "user1", email: "user1@example.com" } },
  db: {
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    onSnapshot: jest.fn(),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
  },
}));

describe("Chat Component", () => {
  test("renders chat component correctly", () => {
    render(<Chat userId="user2" groupId={null} />);
    expect(screen.getByPlaceholderText(/Message @User/i)).toBeInTheDocument();
  });

  test("sends a message", async () => {
    render(<Chat userId="user2" groupId={null} />);
    const input = screen.getByPlaceholderText(/Message @User/i);
    const sendButton = screen.getByText(/Send/i);

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(sendButton);

    expect(addDoc).toHaveBeenCalledTimes(1);
  });

  test("displays received messages", () => {
    onSnapshot.mockImplementation((_, callback) => {
      callback({
        docs: [{ id: "msg1", data: () => ({ text: "Hello", senderId: "user2" }) }],
      });
    });
    
    render(<Chat userId="user2" groupId={null} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("only admin can delete messages", () => {
    render(<Chat userId="user2" groupId={null} />);
    const deleteButton = screen.queryByRole("button", { name: /delete/i });
    expect(deleteButton).not.toBeInTheDocument();
  });
});
