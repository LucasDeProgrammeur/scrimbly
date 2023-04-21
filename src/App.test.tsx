import {
  render,
  screen,
  queryByAttribute,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import ReactLoader from "./components/ReactLoader";
import userEvent from '@testing-library/user-event'
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
  const user = userEvent.setup();
  const view = render(<ReactLoader />);
  const noteButton = await screen.findAllByText("new note");
  user.click(noteButton[0]);
  const editable = getByClass(view.container, "editable");
  fireEvent.focus(editable!);
  await userEvent.type(editable!, "{enter}*test* ", {delay: 100});
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  
  await waitFor(() => {
    expect(editable?.innerHTML).toMatch(/<em>test<\/em>.*/i);    
  });

});

test("rename", async () => {
  const user = userEvent.setup();
  const view = render(<ReactLoader />);
  const fileEntry = await screen.findAllByText("new note");
  user.click(fileEntry[0]);
  const editNoteNameButton =  screen.getAllByLabelText("edit note name")
  
  editNoteNameButton.forEach((x: any) => {
    fireEvent.click(x)
    const entryBar = getByClass(view.container, "entryBarInput");
    fireEvent.focus(entryBar!);
    fireEvent.change(entryBar!, {target: {value: "new note edit"}});
    user.type(entryBar!, "{enter}")
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  await waitFor(() => {
    expect(fileEntry[0]?.textContent).toBe("new note edit");
  });
});

test("deleteNote", async () => {
  const view = render(<ReactLoader />);
  const fileEntry = await screen.findAllByText(/new note.*/i);
  fireEvent.click(fileEntry![0]);
  const deleteButton = getByClass(view.container, "deleteNoteButton red");
  fileEntry.forEach(x => {
    fireEvent.click(x);
    fireEvent.click(deleteButton!);
  })
  expect(screen.queryByText("new note edit")).not.toBeInTheDocument();
});
