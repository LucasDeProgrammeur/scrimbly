import React from "react";
import {
  render,
  screen,
  queryByAttribute,
  fireEvent,
} from "@testing-library/react";
import ReactLoader from "./components/ReactLoader";
import userEvent from "@testing-library/user-event";
import DataHandler from "../public/DataHandler";

window.dbConnection = new DataHandler();

const view = render(<ReactLoader />);
const getByClass = queryByAttribute.bind(null, "class");
jest.mock("../mocks/electronMock.js");


test("newNote", async () => {
  const newNoteButton = getByClass(view.container, "newNoteButton");
  fireEvent.click(newNoteButton!);
  const entryBar = getByClass(view.container, "entryBarInput");
  fireEvent.click(entryBar!);
  fireEvent.change(entryBar!, { target: { value: "new note" } });
  fireEvent.keyUp(entryBar!, { key: "Enter", code: "Enter", charCode: 13 });
  const noteName = getByClass(view.container, "fileEntry selectedEntry");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  expect(
    noteName?.textContent?.substring(0, noteName.textContent.length - 1)
  ).toBe("new note");
});

test("editNote", async () => {
  const view = render(<ReactLoader />);
  const noteButton = await screen.findAllByText("new note");
  userEvent.click(noteButton[0]);
  const editable = getByClass(view.container, "editable");
  userEvent.click(editable!);
  userEvent.keyboard("*test*");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  expect(editable?.innerHTML).toBe("\u200b<em>test</em>\u200b");
});

test("rename", async () => {
  const view = render(<ReactLoader />);
  const fileEntry = await screen.findAllByText("new note");
  userEvent.click(fileEntry![0]);
  fireEvent.click(
    getByClass(view.container, "actionButton editNoteNameButton")!
  );
  const entryBar = getByClass(view.container, "entryBarInput");
  userEvent.click(entryBar!);
  userEvent.keyboard("new note edit{enter}");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  expect(fileEntry[0]?.textContent).toBe("new note edit");
});

test("deleteNote", async () => {
  const view = render(<ReactLoader />);
  const fileEntry = await screen.findAllByText("new note edit");
  fireEvent.click(fileEntry![0]);
  const deleteButton = getByClass(view.container, "deleteNoteButton");
  fireEvent.click(deleteButton!);
  expect(screen.queryByText("new note edit")).not.toBeInTheDocument();
});
